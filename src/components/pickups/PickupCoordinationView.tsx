"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Truck, MapPin, Clock, CheckCircle2, Phone, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

export const PickupCoordinationView: React.FC = () => {
  const [pickups, setPickups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchPickups = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/pickups");
      const data = await res.json();
      if (data.success) setPickups(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleUpdateStatus = async (pickupId: string, newStatus: string) => {
    setUpdatingId(pickupId);
    try {
      const res = await fetch(`/api/pickups/${pickupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        fetchPickups();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return <Badge variant="info">Pickup Scheduled</Badge>;
      case "IN_TRANSIT":
        return <Badge variant="purple">In Transit</Badge>;
      case "ARRIVED":
        return <Badge variant="warning">Driver Arrived</Badge>;
      case "COMPLETED":
        return <Badge variant="success">Rescue Completed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/50 via-slate-900 to-brand-950/40 border border-sky-500/30 shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info">Phase 09 Lifecycle</Badge>
            <Badge variant="success">Real-Time State Engine</Badge>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Pickup Task & Redistribution Coordination</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Track pickup task state transitions (`ASSIGNED` → `IN_TRANSIT` → `COMPLETED`) and automatically trigger impact logging upon arrival.
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
          <Truck className="w-6 h-6" />
        </div>
      </div>

      {/* Pickups Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-200">Active Pickup Coordination Tasks</h3>
          <Badge variant="info">{pickups.length} Tasks</Badge>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="glass-panel p-5 rounded-xl animate-pulse h-32 border border-slate-800" />
            ))}
          </div>
        ) : pickups.length === 0 ? (
          <Card className="text-center py-12">
            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-300 font-semibold">No Active Pickup Tasks</p>
            <p className="text-xs text-slate-500 mt-1">Accept a recipient match in the AI Matcher tab to dispatch a pickup task.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pickups.map((task) => {
              const req = task.surplusRequest;
              const org = task.assignedOrg;

              return (
                <Card key={task.id} className="hover-glow p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(task.status)}
                        <span className="text-[10px] text-slate-500 font-mono">Task ID: {task.id.substring(0, 8)}</span>
                      </div>
                      <h4 className="text-lg font-bold text-white">{req?.foodType || "Surplus Meal Rescue"}</h4>
                      <p className="text-xs text-brand-400 font-medium mt-0.5">Assigned Org: {org?.name}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-brand-400">{req?.quantityPortions} portions</span>
                      <p className="text-xs text-slate-400">~{req?.estimatedWeightKg} kg food weight</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 block">Pickup Location</span>
                        <span className="text-slate-200 font-medium">{req?.pickupLocation}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 block">Pickup Deadline</span>
                        <span className="text-slate-200 font-semibold">{new Date(task.pickupDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 block">Org Contact</span>
                        <span className="text-slate-200 font-medium">{org?.contactName} ({org?.contactPhone})</span>
                      </div>
                    </div>
                  </div>

                  {/* Lifecycle Action Buttons */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Update Redistribution Status:</span>

                    <div className="flex items-center gap-2">
                      {task.status === "ASSIGNED" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          isLoading={updatingId === task.id}
                          onClick={() => handleUpdateStatus(task.id, "IN_TRANSIT")}
                        >
                          <Truck className="w-3.5 h-3.5 mr-1 text-sky-400" /> Start Transit
                        </Button>
                      )}

                      {task.status === "IN_TRANSIT" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          isLoading={updatingId === task.id}
                          onClick={() => handleUpdateStatus(task.id, "ARRIVED")}
                        >
                          <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400" /> Arrived at Location
                        </Button>
                      )}

                      {(task.status === "ARRIVED" || task.status === "IN_TRANSIT" || task.status === "ASSIGNED") && (
                        <Button
                          size="sm"
                          variant="primary"
                          isLoading={updatingId === task.id}
                          onClick={() => handleUpdateStatus(task.id, "COMPLETED")}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Confirm Rescue Completed
                        </Button>
                      )}

                      {task.status === "COMPLETED" && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/50">
                          <CheckCircle2 className="w-4 h-4" /> Impact Logged to Sustainability Dashboard
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
