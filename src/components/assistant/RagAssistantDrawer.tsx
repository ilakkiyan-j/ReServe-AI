"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, MessageSquare, Send, BookOpen, ShieldCheck, X, Bot, User, ArrowRight } from "lucide-react";
import { RagResponse } from "@/lib/ai/ragAssistantAgent";

export const RagAssistantDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "assistant"; content: string; citations?: any[]; badges?: string[] }[]
  >([
    {
      role: "assistant",
      content: "Hello! I am your RAG Knowledge Assistant. Ask me anything about food safety, recipient matching algorithms, onboarding rules, or SDG 12 campus policies.",
      badges: ["GROUNDED IN VERIFIED KNOWLEDGE BASE", "RESPONSIBLE AI GUARANTEE"],
    },
  ]);

  const samplePrompts = [
    "What is the 4-Hour Food Safety Rule?",
    "How are recipient matches scored?",
    "What are recipient onboarding requirements?",
    "What is the UN SDG 12 campus policy?",
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || query;
    if (!q || q.trim().length < 3) return;

    const userMessage = { role: "user" as const, content: q };
    setChatHistory((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const rag: RagResponse = data.data;
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content: rag.answer,
            citations: rag.citations,
            badges: rag.responsibleAiBadges,
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group"
      >
        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold pr-1">Ask RAG Assistant</span>
      </button>

      {/* Slide-over Assistant Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">RAG Knowledge Assistant</h3>
                  <p className="text-[11px] text-slate-400">Grounded strictly in verified food safety docs</p>
                </div>
              </div>

              <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Conversation Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`p-3.5 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-brand-600 text-white rounded-tr-none"
                          : "bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none leading-relaxed"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Responsible AI Safety Badges */}
                    {msg.badges && msg.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {msg.badges.map((b, bIdx) => (
                          <Badge key={bIdx} variant={b.includes("OUT OF DOMAIN") ? "warning" : "purple"} className="text-[9px]">
                            <ShieldCheck className="w-3 h-3 mr-1" /> {b}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Citation Cards */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] space-y-1">
                        <span className="font-semibold text-slate-400 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-brand-400" /> Grounded Source Document Citations:
                        </span>
                        {msg.citations.map((c) => (
                          <div key={c.id} className="text-brand-300 font-medium pl-4">
                            • {c.title} ({c.category})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 items-center text-slate-400 text-xs">
                  <Bot className="w-5 h-5 text-purple-400 animate-spin" />
                  <span>Searching indexed knowledge documents...</span>
                </div>
              )}
            </div>

            {/* Quick Sample Prompt Chips */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Suggested Prompts:</span>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-3 h-3 text-brand-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask RAG Knowledge Assistant..."
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <Button size="sm" variant="primary" onClick={() => handleSend()} isLoading={isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
