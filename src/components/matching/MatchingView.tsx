"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SurplusStatusBadge, UrgencyBadge } from "@/components/surplus/SurplusStatusBadge";
import { MatchingModal } from "@/components/matching/MatchingModal";
import { Sparkles, HeartHandshake, MapPin, Clock, ShieldCheck, AlertCircle } from "lucide-react";

interface MatchingViewProps {
  surplusList: any[];
  onRefresh: () => void;
}

export const MatchingView: React.FC<MatchingViewProps> = ({ surplusList, onRefresh }) => {
  const [selectedSurplus, setSelectedSurplus] = useState<any>(null);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRunMatch = async (surplusItem: any) => {
    setSelectedSurplus(surplusItem);
    setIsMatching(true);

    try {
      const res = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surplusRequestId: surplusItem.id }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Matching agent failed");
      }

      setMatchResult(data.data);
      setIsModalOpen(true);
    } catch (err: any) {
      alert(`Matching failed: ${err.message}`);
    } finally {
      setIsMatching(false);
    }
  };

  const handleDispatchMatch = async (orgId: string) => {
    // In Phase 08 & 09, updating surplus status -> AWAITING_ACCEPTANCE
    if (selectedSurplus) {
      await fetch(`/api/surplus/${selectedSurplus.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "AWAITING_ACCEPTANCE" }),
      });
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-brand-950/40 border border-purple-500/30 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="purple">RESCUE MODE</Badge>
              <Badge variant="success">Strict Verified DB Boundary</Badge>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">AI Verified Recipient Matching Agent</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Ranks verified community NGOs and shelters using transparent scoring (Capacity 30%, Proximity 30%, Deadline 20%, Reliability 20%).
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Surplus Requests Grid for Matching */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-200">Surplus Requests Needing Recipient Matching</h3>
          <Badge variant="purple">{surplusList.length} Active Reports</Badge>
        </div>

        {surplusList.length === 0 ? (
          <Card className="text-center py-12">
            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-300 font-semibold">No Surplus Reports Ready for Matching</p>
            <p className="text-xs text-slate-500 mt-1">Submit a surplus report in the Events tab to run AI matching.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {surplusList.map((item) => (
              <Card key={item.id} className="hover-glow relative flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <SurplusStatusBadge status={item.status} />
                        <UrgencyBadge urgency={item.urgencyLevel} />
                      </div>
                      <h4 className="text-base font-bold text-white">{item.foodType}</h4>
                    </div>
                    <span className="text-lg font-extrabold text-brand-400">{item.quantityPortions} portions</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400 mt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span className="truncate">{item.pickupLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      <span>Deadline: {new Date(item.pickupDeadline).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">ID: {item.id.substring(0, 8)}</span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleRunMatch(item)}
                    isLoading={isMatching && selectedSurplus?.id === item.id}
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" /> Run AI Matcher
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <MatchingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        matchResult={matchResult}
        onDispatchMatch={handleDispatchMatch}
      />
    </div>
  );
};
