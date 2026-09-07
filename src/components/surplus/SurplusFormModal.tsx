"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Utensils, Clock, MapPin, Phone, FileText, X } from "lucide-react";

interface SurplusFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSurplusCreated: () => void;
  preselectedEventId?: string;
  preselectedEventName?: string;
  sourceType?: "EVENT" | "CAFETERIA";
}

export const SurplusFormModal: React.FC<SurplusFormModalProps> = ({
  isOpen,
  onClose,
  onSurplusCreated,
  preselectedEventId,
  preselectedEventName,
  sourceType = "EVENT",
}) => {
  const [foodType, setFoodType] = useState("Vegetarian Hot Prepared Meals");
  const [quantityPortions, setQuantityPortions] = useState<number>(60);
  const [estimatedWeightKg, setEstimatedWeightKg] = useState<number>(15.0);
  const [availableFrom, setAvailableFrom] = useState(new Date().toISOString().substring(0, 16));
  
  // Set default deadline 3 hours in future
  const defaultDeadline = new Date(Date.now() + 3 * 3600 * 1000).toISOString().substring(0, 16);
  const [pickupDeadline, setPickupDeadline] = useState(defaultDeadline);

  const [pickupLocation, setPickupLocation] = useState("Seminar Hall, Ground Floor Counter");
  const [contactPhone, setContactPhone] = useState("+1 (555) 345-6789");
  const [notes, setNotes] = useState("Untouched buffet containers from afternoon conference session.");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (quantityPortions > 0) {
      setEstimatedWeightKg(Number((quantityPortions * 0.25).toFixed(1)));
    }
  }, [quantityPortions]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/surplus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType,
          sourceId: preselectedEventId || undefined,
          foodType,
          quantityPortions: Number(quantityPortions),
          estimatedWeightKg: Number(estimatedWeightKg),
          availableFrom: new Date(availableFrom).toISOString(),
          pickupDeadline: new Date(pickupDeadline).toISOString(),
          pickupLocation,
          contactPhone,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create surplus request");
      }

      onSurplusCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg">
        <Card className="relative p-6 bg-slate-900/95 border-slate-800 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">Manual Surplus Food Report</h2>
            </div>
            <p className="text-xs text-slate-400">
              {preselectedEventName ? `Reporting surplus for event: ${preselectedEventName}` : "Report edible surplus food for immediate community redistribution."}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Food Category & Item Description</label>
              <input
                type="text"
                required
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                placeholder="e.g. Vegetarian Meals, Rice & Curry Boxes"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Portion Count (Meals)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={quantityPortions}
                  onChange={(e) => setQuantityPortions(Number(e.target.value))}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Est. Weight (kg)</label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min={0.1}
                  value={estimatedWeightKg}
                  onChange={(e) => setEstimatedWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Ready Available From</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="datetime-local"
                    required
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-2 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Pickup Deadline</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-rose-400 absolute left-3 top-2.5" />
                  <input
                    type="datetime-local"
                    required
                    value={pickupDeadline}
                    onChange={(e) => setPickupDeadline(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-2 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Pickup Location & Campus Details</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="e.g. Science Hall, Room 102, Ground Floor"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Contact Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Special Packaging & Food Handling Notes</label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Packed in thermal foil boxes, requires pickup vehicle."
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
              Submit Surplus Report
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
