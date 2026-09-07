import { prisma } from "@/lib/db/prisma";

export interface RagResponse {
  query: string;
  answer: string;
  citations: { id: string; title: string; category: string }[];
  confidenceScore: number;
  isGrounded: boolean;
  responsibleAiBadges: string[];
}

// ---------------------------------------------------------------------------
// Score a document against a query using token overlap (TF-IDF approximation)
// Returns a value in [0, 1] representing fraction of query tokens matched.
// ---------------------------------------------------------------------------
function scoreDocument(docText: string, queryTokens: string[]): number {
  if (queryTokens.length === 0) return 0;
  const lower = docText.toLowerCase();
  const matched = queryTokens.filter((t) => lower.includes(t));
  return matched.length / queryTokens.length;
}

// ---------------------------------------------------------------------------
// Extract the most relevant sentences from document content for a given query.
// Returns up to `maxSentences` sentences that contain at least one query token.
// ---------------------------------------------------------------------------
function extractRelevantSentences(content: string, queryTokens: string[], maxSentences = 3): string {
  const sentences = content
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const scored = sentences.map((s) => ({
    sentence: s,
    score: queryTokens.filter((t) => s.toLowerCase().includes(t)).length,
  }));

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .map((s) => s.sentence)
    .join(" ");
}

// Minimum score threshold for a document to be considered relevant.
// A query must match at least 40% of its meaningful tokens against a document
// to be considered in-domain. This prevents incidental single-word matches
// (e.g. "building" in an out-of-domain query) from scoring above the boundary.
const RELEVANCE_THRESHOLD = 0.40;

export async function answerRagQuery(userQuery: string): Promise<RagResponse> {
  const queryLower = userQuery.toLowerCase().trim();
  const queryTokens = queryLower.split(/\s+/).filter((t) => t.length > 2);

  // Retrieve all indexed knowledge documents
  const allDocs = await prisma.knowledgeDocument.findMany();

  if (allDocs.length === 0) {
    return {
      query: userQuery,
      answer:
        "The knowledge base is currently empty. Please ask a system administrator to seed the knowledge documents.",
      citations: [],
      confidenceScore: 0,
      isGrounded: false,
      responsibleAiBadges: ["KNOWLEDGE BASE UNAVAILABLE"],
    };
  }

  // Score every document against the query
  const scoredDocs = allDocs
    .map((doc) => ({
      doc,
      score: scoreDocument(`${doc.title} ${doc.category} ${doc.content}`, queryTokens),
    }))
    .sort((a, b) => b.score - a.score);

  const topDocs = scoredDocs.filter((d) => d.score >= RELEVANCE_THRESHOLD).slice(0, 2);

  // Out-of-domain boundary: no documents score above threshold
  if (topDocs.length === 0) {
    return {
      query: userQuery,
      answer:
        "I am the Campus Food Rescue AI Knowledge Assistant. My answers are strictly grounded in verified campus food safety, recipient onboarding, and SDG 12 waste prevention guidelines. I do not answer questions outside this domain. Please ask about food safety, recipient matching, or surplus reporting guidelines.",
      citations: [],
      confidenceScore: 0,
      isGrounded: false,
      responsibleAiBadges: ["OUT OF DOMAIN SCOPE — BOUNDARY ENFORCED"],
    };
  }

  // Build a grounded answer from the actual content of the top-ranked documents
  const answerParts: string[] = [];
  for (const { doc } of topDocs) {
    const excerpt = extractRelevantSentences(doc.content, queryTokens, 3);
    if (excerpt) answerParts.push(excerpt);
  }

  // If sentence extraction yields nothing (very short docs), fall back to the first 300 chars of top doc
  const answer =
    answerParts.length > 0
      ? answerParts.join(" ")
      : topDocs[0].doc.content.slice(0, 300);

  const citations = topDocs.map((d) => ({
    id: d.doc.id,
    title: d.doc.title,
    category: d.doc.category,
  }));

  // Confidence = average of top document scores, capped at 0.99
  const avgScore = topDocs.reduce((sum, d) => sum + d.score, 0) / topDocs.length;
  const confidenceScore = Number(Math.min(avgScore, 0.99).toFixed(2));

  const badges = ["GROUNDED IN VERIFIED KNOWLEDGE BASE"];
  const topCategory = topDocs[0].doc.category.toUpperCase();
  if (topCategory.includes("FOOD SAFETY")) badges.push("FDA FOOD SAFETY COMPLIANT");
  if (topCategory.includes("SDG")) badges.push("UN SDG 12 & SDG 2 ALIGNED");
  if (topCategory.includes("ONBOARD")) badges.push("HUMAN VERIFICATION REQUIRED");

  return {
    query: userQuery,
    answer,
    citations,
    confidenceScore,
    isGrounded: true,
    responsibleAiBadges: badges,
  };
}
