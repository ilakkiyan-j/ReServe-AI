"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { UserRole } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EventFormModal } from "@/components/events/EventFormModal";
import { EventList } from "@/components/events/EventList";
import { SurplusFormModal } from "@/components/surplus/SurplusFormModal";
import { SurplusList } from "@/components/surplus/SurplusList";
import { NlpIntakeModal } from "@/components/surplus/NlpIntakeModal";
import { PredictionCard } from "@/components/prediction/PredictionCard";
import { PredictionChart } from "@/components/prediction/PredictionChart";
import { HistoricalLogsTable } from "@/components/prediction/HistoricalLogsTable";
import { PredictionFormModal } from "@/components/prediction/PredictionFormModal";
import { MatchingView } from "@/components/matching/MatchingView";
import { PickupCoordinationView } from "@/components/pickups/PickupCoordinationView";
import { ImpactAnalyticsView } from "@/components/impact/ImpactAnalyticsView";
import { RagAssistantDrawer } from "@/components/assistant/RagAssistantDrawer";
import { useToast } from "@/components/ui/Toast";
import {
  Utensils, Sparkles, HeartHandshake, TrendingUp, ShieldCheck,
  Plus, Leaf, BarChart3, Clock, ArrowRight, BookOpen,
  AlertCircle,
} from "lucide-react";
import { SustainabilityMetrics } from "@/lib/ai/impactAgent";

// ─── Skeleton helpers ────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="glass-panel rounded-xl p-6 border border-slate-800 animate-pulse">
    <div className="skeleton h-3 w-1/3 rounded mb-3" />
    <div className="skeleton h-8 w-1/2 rounded mb-2" />
    <div className="skeleton h-2 w-2/3 rounded" />
  </div>
);

// ─── Role-aware quick-action configs ─────────────────────────────────────────
const roleWelcome: Record<UserRole, { title: string; subtitle: string; color: string }> = {
  ADMIN: {
    title: "Campus Admin Dashboard",
    subtitle: "Monitor all surplus activity, verify organizations, and review system-wide impact.",
    color: "from-purple-900/40 via-slate-900/60 to-slate-900/80",
  },
  CAFETERIA_MANAGER: {
    title: "Cafeteria Manager Dashboard",
    subtitle: "View demand forecasts, log actual consumption, and prevent over-preparation waste.",
    color: "from-emerald-900/40 via-slate-900/60 to-slate-900/80",
  },
  EVENT_MANAGER: {
    title: "Event Manager Dashboard",
    subtitle: "Register events, report surplus food via AI text intake, and track redistribution.",
    color: "from-sky-900/40 via-slate-900/60 to-slate-900/80",
  },
  RECIPIENT_ORGANIZATION: {
    title: "Recipient Organization Dashboard",
    subtitle: "Review incoming surplus matches, accept requests, and confirm pickup completion.",
    color: "from-amber-900/40 via-slate-900/60 to-slate-900/80",
  },
};

export default function HomePage() {
  const { toast } = useToast();
  const [currentRole, setCurrentRole] = useState<UserRole>("EVENT_MANAGER");
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Data state
  const [events, setEvents] = useState<any[]>([]);
  const [surplusList, setSurplusList] = useState<any[]>([]);
  const [impactMetrics, setImpactMetrics] = useState<SustainabilityMetrics | null>(null);
  const [predictionData, setPredictionData] = useState<any>(null);

  // Loading state
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingSurplus, setLoadingSurplus] = useState(false);
  const [loadingImpact, setLoadingImpact] = useState(true);

  // Modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isSurplusModalOpen, setIsSurplusModalOpen] = useState(false);
  const [isNlpModalOpen, setIsNlpModalOpen] = useState(false);
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const fetchEvents = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success) setEvents(data.data);
    } catch { } finally {
      setLoadingEvents(false);
    }
  }, []);

  const fetchSurplus = useCallback(async () => {
    setLoadingSurplus(true);
    try {
      const res = await fetch("/api/surplus");
      const data = await res.json();
      if (data.success) setSurplusList(data.data);
    } catch { } finally {
      setLoadingSurplus(false);
    }
  }, []);

  const fetchImpact = useCallback(async () => {
    setLoadingImpact(true);
    try {
      const res = await fetch("/api/impact");
      const data = await res.json();
      if (data.success) setImpactMetrics(data.data);
    } catch { } finally {
      setLoadingImpact(false);
    }
  }, []);

  const fetchPrediction = useCallback(async () => {
    try {
      const res = await fetch("/api/prediction");
      const data = await res.json();
      if (data.success) setPredictionData(data.data);
    } catch { }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchSurplus();
    fetchImpact();
    fetchPrediction();
  }, []);

  const handleReportSurplusForEvent = (eventItem: any) => {
    setSelectedEvent(eventItem);
    setIsSurplusModalOpen(true);
  };

  const welcome = roleWelcome[currentRole];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
      <Navbar currentRole={currentRole} onRoleChange={setCurrentRole} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentRole={currentRole} activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">

          {/* ── MATCHING TAB ────────────────────────────── */}
          {activeTab === "matching" && (
            <MatchingView
              surplusList={surplusList}
              onRefresh={() => { fetchSurplus(); fetchEvents(); }}
            />
          )}

          {/* ── PICKUPS TAB ─────────────────────────────── */}
          {activeTab === "pickups" && <PickupCoordinationView />}

          {/* ── IMPACT TAB ──────────────────────────────── */}
          {activeTab === "impact" && <ImpactAnalyticsView />}

          {/* ── RAG TAB ─────────────────────────────────── */}
          {activeTab === "rag" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">AI Knowledge Assistant</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Ask questions grounded in the verified campus food safety, SDG 12 policy, and onboarding knowledge base.
                </p>
              </div>
              <Card className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-slate-100">RAG Assistant is available in the bottom-right corner</p>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Click the <span className="text-purple-400 font-medium">AI Assistant</span> button at the bottom-right of the screen to open the knowledge Q&A drawer.
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* ── ADMIN TAB ───────────────────────────────── */}
          {activeTab === "admin" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Recipient Organization Registry</h2>
                <p className="text-sm text-slate-400 mt-1">Manage and verify recipient organizations. Only VERIFIED organizations are eligible for surplus matching.</p>
              </div>
              <Card>
                <div className="flex items-center gap-3 p-2 text-sm text-slate-400">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Recipient organization management is handled via the database seed and admin API. Use <code className="text-brand-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">prisma studio</code> or the <code className="text-brand-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">ADMIN</code> role API endpoints to verify organizations.
                </div>
              </Card>
            </div>
          )}

          {/* ── OVERVIEW TAB ────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-8 max-w-6xl">

              {/* Welcome Banner */}
              <div className={`p-6 rounded-2xl bg-gradient-to-r ${welcome.color} border border-slate-700/50 shadow-lg`}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="success">SDG 12 — Responsible Consumption</Badge>
                      <Badge variant="purple">SDG 2 — Zero Hunger</Badge>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                      {welcome.title}
                    </h1>
                    <p className="text-sm text-slate-300 mt-1 max-w-xl">{welcome.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {(currentRole === "EVENT_MANAGER" || currentRole === "ADMIN") && (
                      <Button variant="primary" size="sm" onClick={() => setIsNlpModalOpen(true)}>
                        <Sparkles className="w-4 h-4 mr-1.5" /> AI Surplus Intake
                      </Button>
                    )}
                    {(currentRole === "EVENT_MANAGER" || currentRole === "ADMIN" || currentRole === "CAFETERIA_MANAGER") && (
                      <Button variant="outline" size="sm" onClick={() => setIsSurplusModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-1" /> Manual Report
                      </Button>
                    )}
                    {currentRole === "CAFETERIA_MANAGER" && (
                      <Button variant="outline" size="sm" onClick={() => setIsPredictionModalOpen(true)}>
                        <TrendingUp className="w-4 h-4 mr-1" /> Run Forecast
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* KPI Metrics Grid — live from /api/impact */}
              {loadingImpact ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <Card className="hover-glow cursor-pointer" onClick={() => setActiveTab("impact")}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-400">Total Meals Rescued</p>
                        <h3 className="text-3xl font-black text-brand-400 mt-1">
                          {(impactMetrics?.totalMealsRescued ?? 0).toLocaleString()}
                        </h3>
                        <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                          {impactMetrics?.successfulRedistributions ?? 0} redistributions
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                        <Utensils className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-1 text-xs text-brand-400">
                      View analytics <ArrowRight className="w-3 h-3" />
                    </div>
                  </Card>

                  <Card className="hover-glow">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-400">Food Weight Prevented</p>
                        <h3 className="text-3xl font-black text-emerald-400 mt-1">
                          {(impactMetrics?.estimatedWeightKg ?? 0).toFixed(1)} kg
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="default" className="text-[9px] py-0">ESTIMATED</Badge>
                          <p className="text-[11px] text-slate-400">from disposal</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Leaf className="w-5 h-5" />
                      </div>
                    </div>
                  </Card>

                  <Card className="hover-glow cursor-pointer" onClick={() => setActiveTab("events")}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-400">Active Surplus Reports</p>
                        <h3 className="text-3xl font-black text-sky-400 mt-1">
                          {loadingSurplus ? "—" : surplusList.length}
                        </h3>
                        <p className="text-[11px] text-sky-400 mt-1 font-medium">
                          {loadingEvents ? "—" : events.length} campus events
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-1 text-xs text-sky-400">
                      View reports <ArrowRight className="w-3 h-3" />
                    </div>
                  </Card>

                  <Card className="hover-glow">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-400">Match Success Rate</p>
                        <h3 className="text-3xl font-black text-purple-400 mt-1">
                          {impactMetrics?.matchSuccessRate ?? 0}%
                        </h3>
                        <p className="text-[11px] text-purple-400 mt-1 font-medium">
                          {impactMetrics?.verifiedOrganizationsCount ?? 0} verified orgs
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Role-aware quick links + recent surplus */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Quick Actions */}
                <Card title="Quick Actions" subtitle="Common tasks for your role">
                  <div className="space-y-2 mt-1">
                    {(currentRole === "EVENT_MANAGER" || currentRole === "ADMIN") && (
                      <>
                        <QuickActionButton
                          icon={<Sparkles className="w-4 h-4 text-brand-400" />}
                          label="Report Surplus via AI Text"
                          description="Describe surplus in plain text — AI extracts all fields"
                          onClick={() => setIsNlpModalOpen(true)}
                        />
                        <QuickActionButton
                          icon={<Plus className="w-4 h-4 text-sky-400" />}
                          label="Register a Campus Event"
                          description="Add an upcoming event for surplus tracking"
                          onClick={() => setIsEventModalOpen(true)}
                        />
                      </>
                    )}
                    {currentRole === "CAFETERIA_MANAGER" && (
                      <>
                        <QuickActionButton
                          icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
                          label="Run Demand Forecast"
                          description="Generate today's predicted meal consumption"
                          onClick={() => setIsPredictionModalOpen(true)}
                        />
                        <QuickActionButton
                          icon={<Plus className="w-4 h-4 text-sky-400" />}
                          label="Report Cafeteria Surplus"
                          description="Submit a manual surplus request form"
                          onClick={() => { setSelectedEvent(null); setIsSurplusModalOpen(true); }}
                        />
                      </>
                    )}
                    {currentRole === "RECIPIENT_ORGANIZATION" && (
                      <QuickActionButton
                        icon={<HeartHandshake className="w-4 h-4 text-amber-400" />}
                        label="View Incoming Matches"
                        description="Review surplus requests matched to your organization"
                        onClick={() => setActiveTab("matching")}
                      />
                    )}
                    <QuickActionButton
                      icon={<BarChart3 className="w-4 h-4 text-purple-400" />}
                      label="View Impact Dashboard"
                      description="SDG 12 sustainability metrics and CO2 savings"
                      onClick={() => setActiveTab("impact")}
                    />
                  </div>
                </Card>

                {/* Recent Surplus Feed */}
                <Card
                  title="Recent Surplus Requests"
                  subtitle="Latest food reports from the database"
                  action={
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("events")}>
                      View all <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  }
                >
                  {loadingSurplus ? (
                    <div className="space-y-2 mt-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-14 rounded-lg" />
                      ))}
                    </div>
                  ) : surplusList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
                      <p className="text-sm font-medium text-slate-400">No surplus reports yet</p>
                      <p className="text-xs text-slate-500 mt-0.5">Reports submitted by event managers will appear here.</p>
                    </div>
                  ) : (
                    <SurplusList surplusList={surplusList.slice(0, 4)} isLoading={false} />
                  )}
                </Card>
              </div>

              {/* CAFETERIA_MANAGER: show latest prediction inline */}
              {currentRole === "CAFETERIA_MANAGER" && predictionData?.latestPrediction && (
                <Card title="Latest Demand Forecast" subtitle="Today's cafeteria preparation recommendation">
                  <PredictionCard
                    prediction={predictionData.latestPrediction}
                    onOpenForm={() => setIsPredictionModalOpen(true)}
                  />
                </Card>
              )}

              {/* SDG callout */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/30 flex items-start gap-3">
                <Leaf className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-emerald-300">UN SDG 12 Aligned: </span>
                  Every surplus request redirected from disposal contributes towards halving campus food waste by 2030.
                  Environmental metrics are transparent estimates per UNEP/FAO methodology (2.5 kg CO₂ per kg food).
                </div>
              </div>
            </div>
          )}

          {/* ── EVENTS & SURPLUS TAB ────────────────────── */}
          {activeTab === "events" && (
            <div className="space-y-8 max-w-6xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Events & Surplus Intake</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Register campus events and report unavoidable surplus food for redistribution.
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => setIsEventModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" /> Register Event
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => setIsNlpModalOpen(true)}>
                    <Sparkles className="w-4 h-4 mr-1.5" /> AI Text Intake
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => { setSelectedEvent(null); setIsSurplusModalOpen(true); }}>
                    <Plus className="w-4 h-4 mr-1" /> Manual Report
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-200">Registered Campus Events</h3>
                  <Badge variant="info">{events.length} Events</Badge>
                </div>
                <EventList
                  events={events}
                  isLoading={loadingEvents}
                  onReportSurplusForEvent={handleReportSurplusForEvent}
                />
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-200">Surplus Food Requests</h3>
                  <Badge variant="warning">{surplusList.length} Reports</Badge>
                </div>
                <SurplusList surplusList={surplusList} isLoading={loadingSurplus} />
              </div>
            </div>
          )}

          {/* ── PREVENT TAB (Cafeteria Forecast) ────────── */}
          {activeTab === "prevent" && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    PREVENT Mode — Cafeteria Demand Forecast
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Predict meal consumption and optimize preparation quantities to eliminate avoidable surplus.
                  </p>
                </div>
                <Button variant="primary" size="sm" onClick={() => setIsPredictionModalOpen(true)}>
                  <Sparkles className="w-4 h-4 mr-1" /> Run Custom Forecast
                </Button>
              </div>

              {predictionData?.latestPrediction && (
                <PredictionCard
                  prediction={predictionData.latestPrediction}
                  onOpenForm={() => setIsPredictionModalOpen(true)}
                />
              )}

              {predictionData?.historicalLogs && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PredictionChart logs={predictionData.historicalLogs} />
                  <HistoricalLogsTable
                    logs={predictionData.historicalLogs}
                    metrics={predictionData.accuracyMetrics ?? { mae: 0, rmse: 0, sampleCount: 0 }}
                  />
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Modals */}
      <EventFormModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onEventCreated={() => { fetchEvents(); fetchSurplus(); toast("success", "Event registered", "The campus event has been saved."); }}
      />
      <SurplusFormModal
        isOpen={isSurplusModalOpen}
        onClose={() => { setIsSurplusModalOpen(false); setSelectedEvent(null); }}
        onSurplusCreated={() => { fetchSurplus(); fetchImpact(); toast("success", "Surplus reported", "Your surplus report has been submitted for matching."); }}
        preselectedEventId={selectedEvent?.id}
        preselectedEventName={selectedEvent?.name}
        sourceType={selectedEvent ? "EVENT" : "CAFETERIA"}
      />
      <PredictionFormModal
        isOpen={isPredictionModalOpen}
        onClose={() => setIsPredictionModalOpen(false)}
        onPredictionGenerated={() => fetchPrediction()}
      />
      <NlpIntakeModal
        isOpen={isNlpModalOpen}
        onClose={() => setIsNlpModalOpen(false)}
        onSurplusCreated={() => { fetchSurplus(); fetchImpact(); toast("success", "Surplus extracted & saved", "AI successfully extracted and stored your surplus report."); }}
      />
      <RagAssistantDrawer />
    </div>
  );
}

// ─── Quick Action Button ──────────────────────────────────────────────────────
interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}
const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, label, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-800 hover:border-brand-500/30 hover:bg-slate-800/40 transition-all text-left group"
  >
    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-slate-700 transition-colors">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{label}</p>
      <p className="text-xs text-slate-500 truncate">{description}</p>
    </div>
    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-brand-400 transition-colors shrink-0" />
  </button>
);
