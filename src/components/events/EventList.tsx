"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Calendar, MapPin, Users, Utensils, AlertCircle } from "lucide-react";

interface EventItem {
  id: string;
  name: string;
  department: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  expectedAttendance: number;
  mealsPrepared?: number | null;
  foodProvider: string;
  organizer?: { name: string; email: string };
  surplusRequests?: any[];
}

interface EventListProps {
  events: EventItem[];
  isLoading: boolean;
  onReportSurplusForEvent: (event: EventItem) => void;
}

export const EventList: React.FC<EventListProps> = ({ events, isLoading, onReportSurplusForEvent }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="glass-panel p-5 rounded-xl animate-pulse h-40 border border-slate-800" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="text-center py-10">
        <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <p className="text-slate-300 font-semibold">No Campus Events Registered Yet</p>
        <p className="text-xs text-slate-500 mt-1">Click "Register Campus Event" to create the first event record.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {events.map((evt) => {
        const formattedDate = new Date(evt.eventDate).toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        const hasSurplus = evt.surplusRequests && evt.surplusRequests.length > 0;

        return (
          <Card key={evt.id} className="hover-glow relative flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <Badge variant="info" className="mb-1 text-[10px]">{evt.department}</Badge>
                  <h4 className="text-base font-bold text-slate-100 leading-tight">{evt.name}</h4>
                </div>
                {hasSurplus ? (
                  <Badge variant="success">Surplus Reported ({evt.surplusRequests?.length})</Badge>
                ) : (
                  <Badge variant="warning">No Surplus Logged</Badge>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 mt-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-brand-400" />
                  <span>{formattedDate} ({evt.startTime} - {evt.endTime})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>{evt.location}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-400" /> Expected: <strong className="text-slate-200">{evt.expectedAttendance}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-amber-400" /> Prepared: <strong className="text-slate-200">{evt.mealsPrepared || "N/A"}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Provider: {evt.foodProvider}</span>
              <button
                onClick={() => onReportSurplusForEvent(evt)}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
              >
                + Report Surplus Food
              </button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
