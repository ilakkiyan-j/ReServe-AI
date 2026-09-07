"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { SurplusStatusBadge, UrgencyBadge } from "@/components/surplus/SurplusStatusBadge";
import { Utensils, Clock, MapPin, Phone, AlertCircle } from "lucide-react";

interface SurplusItem {
  id: string;
  sourceType: string;
  foodType: string;
  quantityPortions: number;
  estimatedWeightKg: number;
  availableFrom: string;
  pickupDeadline: string;
  pickupLocation: string;
  contactPhone: string;
  notes?: string | null;
  urgencyLevel: string;
  status: string;
  createdAt: string;
  event?: { name: string };
  reporter?: { name: string; email: string };
}

interface SurplusListProps {
  surplusList: SurplusItem[];
  isLoading: boolean;
}

export const SurplusList: React.FC<SurplusListProps> = ({ surplusList, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="glass-panel p-4 rounded-xl animate-pulse h-28 border border-slate-800" />
        ))}
      </div>
    );
  }

  if (surplusList.length === 0) {
    return (
      <Card className="text-center py-8">
        <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-slate-300 font-semibold text-sm">No Active Surplus Reports</p>
        <p className="text-xs text-slate-500 mt-0.5">Submit a report to begin AI matching.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {surplusList.map((item) => {
        const deadlineDate = new Date(item.pickupDeadline).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <Card key={item.id} className="hover-glow p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <SurplusStatusBadge status={item.status} />
                  <UrgencyBadge urgency={item.urgencyLevel} />
                  <span className="text-[10px] text-slate-500 font-mono">ID: {item.id.substring(0, 8)}</span>
                </div>
                <h4 className="text-base font-bold text-slate-100">{item.foodType}</h4>
                {item.event && (
                  <p className="text-xs text-brand-400 mt-0.5">Source Event: {item.event.name}</p>
                )}
              </div>

              <div className="text-right">
                <span className="text-xl font-extrabold text-brand-400">{item.quantityPortions} portions</span>
                <p className="text-xs text-slate-400 font-medium">~{item.estimatedWeightKg} kg food weight</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Pickup Deadline</span>
                  <span className="text-slate-200 font-semibold">{deadlineDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-slate-500 block">Pickup Location</span>
                  <span className="text-slate-200 font-medium truncate block">{item.pickupLocation}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Contact Phone</span>
                  <span className="text-slate-200 font-medium">{item.contactPhone}</span>
                </div>
              </div>
            </div>

            {item.notes && (
              <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 italic">
                Notes: {item.notes}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
