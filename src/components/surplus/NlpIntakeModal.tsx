"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, MessageSquare, AlertTriangle, CheckCircle2, Clock, MapPin, X, ArrowRight, ShieldCheck } from "lucide-react";

interface NlpIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSurplusCreated: () => void;
}

export const NlpIntakeModal: React.FC<NlpIntakeModalProps> = ({ isOpen, onClose, onSurplusCreated }) => {
  const [rawText, setRawText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  // Verification & Edit Form State
  const [foodType, setFoodType] = useState("");
  const [quantityPortions, setQuantityPortions] = useState<number>(60);
  const [estimatedWeightKg, setEstimatedWeightKg] = useState<number>(15.0);
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDeadline, setPickupDeadline] = useState("");
  const [contactPhone, setContactPhone] = useState("+1 (555) 345-6789");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const samplePrompts = [
    "We have around 65 vegetarian meals left from today's AI workshop. They are at Seminar Hall and available until 8 PM.",
    "Cafeteria Lunch Surplus: 80 portions of prepared rice & curry boxes at Central Mess, ready now until 3 PM.",
    "Leftover sandwiches from Student Club session at Science Hall.",
  ];

  const handleExtract = async (textToExtract?: string) => {
    const text = textToExtract || rawText;
    if (!text || text.trim().length < 5) {
      setError("Please enter a conversational report with at least 5 characters.");
      return;
    }

    setError("");
    setIsExtracting(true);
    setExtractedData(null);

    try {
      const res = await fetch("/api/surplus/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: text }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to extract entities");
      }

      const ext = data.data;
      setExtractedData(ext);

      // Pre-fill editable form
      setFoodType(ext.foodCategory !== "unknown" ? `${ext.foodCategory} Prepared Meals` : "Prepared Meals");
      setQuantityPortions(ext.quantityPortions !== "unknown" ? Number(ext.quantityPortions) : 50);
      setEstimatedWeightKg(ext.quantityPortions !== "unknown" ? Number((ext.quantityPortions * 0.25).toFixed(1)) : 12.5);
      setPickupLocation(ext.pickupLocation !== "unknown" ? ext.pickupLocation : "Seminar Hall, Ground Floor");
      
      const deadlineDate = ext.pickupDeadline !== "unknown" ? new Date(ext.pickupDeadline) : new Date(Date.now() + 3 * 3600 * 1000);
      setPickupDeadline(deadlineDate.toISOString().substring(0, 16));
      setNotes(ext.notes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/surplus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: "EVENT",
          foodType,
          quantityPortions: Number(quantityPortions),
          estimatedWeightKg: Number(estimatedWeightKg),
          availableFrom: new Date().toISOString(),
          pickupDeadline: new Date(pickupDeadline).toISOString(),
          pickupLocation,
          contactPhone,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit surplus request");
      }

      onSurplusCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
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
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">AI Natural Language Surplus Intake</h2>
              <Badge variant="purple">Phase 07 NLP Agent</Badge>
            </div>
            <p className="text-xs text-slate-400">Type or paste natural language report. AI will extract structured surplus request entities.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Text Input & Extraction */}
          {!extractedData ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-brand-400" /> Conversational Food Surplus Report
                </label>
                <textarea
                  rows={4}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="e.g. We have around 65 vegetarian meals left from today's AI workshop. They are at Seminar Hall and available until 8 PM."
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-brand-500 leading-relaxed placeholder:text-slate-500"
                />
              </div>

              {/* One-Click Sample Prompts */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Try One-Click Test Prompts:</span>
                <div className="space-y-2">
                  {samplePrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => { setRawText(prompt); handleExtract(prompt); }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                    >
                      <span className="truncate pr-2">"{prompt}"</span>
                      <ArrowRight className="w-3.5 h-3.5 text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => handleExtract()}
                variant="primary"
                className="w-full mt-4"
                isLoading={isExtracting}
              >
                <Sparkles className="w-4 h-4 mr-2" /> Run AI Entity Extractor
              </Button>
            </div>
          ) : (
            /* Step 2: Human Verification & Confirmation Form */
            <form onSubmit={handleConfirmSubmit} className="space-y-5 animate-fade-in">
              {/* Extraction Confidence Header */}
              <div className="p-3.5 rounded-xl bg-brand-950/40 border border-brand-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">AI Extraction Confidence: {Math.round(extractedData.confidenceScore * 100)}%</p>
                    <p className="text-[11px] text-slate-400">Strict Human-in-the-Loop Verification Protocol</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setExtractedData(null)}
                  className="text-xs text-brand-400 hover:underline font-semibold"
                >
                  Re-parse Text
                </button>
              </div>

              {/* Extraction Warnings */}
              {extractedData.warnings && extractedData.warnings.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                  <span className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Extractor Safeguard Alerts:
                  </span>
                  {extractedData.warnings.map((w: string, idx: number) => (
                    <p key={idx} className="text-[11px] pl-5">• {w}</p>
                  ))}
                </div>
              )}

              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Food Category / Type</label>
                  <input
                    type="text"
                    required
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Portion Count (Meals)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quantityPortions}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      setQuantityPortions(num);
                      setEstimatedWeightKg(Number((num * 0.25).toFixed(1)));
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Pickup Location</label>
                  <input
                    type="text"
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Pickup Deadline</label>
                  <input
                    type="datetime-local"
                    required
                    value={pickupDeadline}
                    onChange={(e) => setPickupDeadline(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Original Text Input</label>
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-400 italic">
                  "{extractedData.notes}"
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setExtractedData(null)}>
                  Back to Text
                </Button>
                <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Confirm & Submit Request
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
