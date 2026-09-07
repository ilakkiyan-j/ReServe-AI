"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MatchRecommendationResult } from "@/lib/ai/matchingAgent";
import { Sparkles, ShieldCheck, MapPin, Phone, CheckCircle, AlertTriangle, ArrowRight, X, HeartHandshake } from "lucide-react";

interface MatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchResult: MatchRecommendationResult | null;
  onDispatchMatch: (orgId: string) => void;
}

export const MatchingModal: React.FC<MatchingModalProps> = ({
  isOpen,
  onClose,
  matchResult,
  onDispatchMatch,
}) => {
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  if (!isOpen || !matchResult) return null;

  const topRec = matchResult.recommendedCandidate;

  const handleDispatch = async () => {
    setIsDispatching(true);
    try {
      await onDispatchMatch(topRec.organizationId);
      setDispatchedSuccess(true);
      setTimeout(() => {
        setDispatchedSuccess(false);
        onClose();
      }, 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl my-8">
        <Card className="relative p-6 bg-slate-900/95 border-slate-800 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="mb-5 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">AI Verified Recipient Matching</h2>
              <Badge variant="purple">Phase 08 RESCUE Agent</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Matching <span className="text-brand-400 font-semibold">{matchResult.quantityPortions} portions</span> of <span className="text-white font-medium">{matchResult.foodType}</span> with verified community recipient organizations.
            </p>
          </div>

          {/* Top Recommendation Banner */}
          <div className="mb-6 p-5 rounded-xl bg-gradient-to-br from-brand-950/60 via-slate-900 to-purple-950/40 border border-brand-500/30">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="success">BEST MATCH (#1 Candidate)</Badge>
                  <Badge variant="purple">{topRec.type.replace("_", " ")}</Badge>
                </div>
                <h3 className="text-xl font-extrabold text-white">{topRec.organizationName}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" /> {topRec.locationAddress} • ({topRec.serviceArea})
                </p>
              </div>

              {/* Match Score Badge */}
              <div className="text-right shrink-0">
                <div className="text-3xl font-black text-brand-400">{topRec.totalMatchScore} <span className="text-sm font-normal text-slate-400">/ 100</span></div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Transparent Score</p>
              </div>
            </div>

            {/* Score Breakdown Bar */}
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-500 block">Capacity (30%)</span>
                <span className="font-semibold text-brand-400">{topRec.scoreBreakdown.capacityScore}%</span>
              </div>
              <div>
                <span className="text-slate-500 block">Proximity (30%)</span>
                <span className="font-semibold text-sky-400">{topRec.scoreBreakdown.distanceScore}%</span>
              </div>
              <div>
                <span className="text-slate-500 block">Deadline (20%)</span>
                <span className="font-semibold text-amber-400">{topRec.scoreBreakdown.deadlineScore}%</span>
              </div>
              <div>
                <span className="text-slate-500 block">Reliability (20%)</span>
                <span className="font-semibold text-purple-400">{topRec.scoreBreakdown.reliabilityScore}%</span>
              </div>
            </div>

            {/* AI Explainability Rationale */}
            <div className="mt-4 p-3 rounded-lg bg-slate-800/60 text-xs text-slate-300 border border-slate-700/60">
              <span className="font-semibold text-brand-300">AI Match Rationale: </span>
              {topRec.explanation}
            </div>

            {/* Potential Risk Issues */}
            {topRec.potentialIssues && topRec.potentialIssues.length > 0 && (
              <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                <span className="font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Logistical Risk Warnings:
                </span>
                {topRec.potentialIssues.map((issue, idx) => (
                  <p key={idx} className="text-[11px] pl-4">• {issue}</p>
                ))}
              </div>
            )}
          </div>

          {/* Alternative Candidates */}
          {matchResult.alternativeCandidates.length > 0 && (
            <div className="mb-6 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ranked Alternative Recipient Candidates</span>
              <div className="space-y-2">
                {matchResult.alternativeCandidates.map((alt, idx) => (
                  <div key={alt.organizationId} className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">#{idx + 2} {alt.organizationName}</span>
                        <Badge variant="default" className="text-[9px]">{alt.type}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{alt.serviceArea} • Max Cap: {alt.maxCapacityMeals} portions</p>
                    </div>
                    <Badge variant="purple" className="font-semibold">{alt.totalMatchScore} / 100</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dispatch Action */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              isLoading={isDispatching}
              onClick={handleDispatch}
              disabled={dispatchedSuccess}
            >
              {dispatchedSuccess ? (
                <span className="flex items-center gap-1 text-emerald-300">
                  <CheckCircle className="w-4 h-4" /> Match Dispatched!
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <HeartHandshake className="w-4 h-4 mr-1" /> Dispatch Match to Recipient Org
                </span>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
