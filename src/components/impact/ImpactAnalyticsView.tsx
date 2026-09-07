"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SustainabilityMetrics } from "@/lib/ai/impactAgent";
import { BarChart3, Utensils, HeartHandshake, TrendingUp, DollarSign, ShieldCheck, Leaf, Info, Award } from "lucide-react";

export const ImpactAnalyticsView: React.FC = () => {
  const [metrics, setMetrics] = useState<SustainabilityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImpactMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/impact");
      const data = await res.json();
      if (data.success) setMetrics(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImpactMetrics();
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="glass-panel p-6 rounded-2xl h-32 border border-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-panel p-5 rounded-xl h-28 border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  const maxTrendMeals = Math.max(...metrics.monthlyTrend.map((t) => t.mealsRescued), 1000);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/40 border border-emerald-500/30 shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="success">SDG 12 — Responsible Consumption</Badge>
            <Badge variant="purple">SDG 2 — Zero Hunger</Badge>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Campus Sustainability & Impact Dashboard</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Live database analytics tracking food waste prevention, community redistribution, and environmental savings.
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Award className="w-6 h-6" />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="hover-glow">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400">Total Meals Rescued</span>
              <h3 className="text-3xl font-black text-brand-400 mt-1">{metrics.totalMealsRescued.toLocaleString()}</h3>
              <p className="text-[11px] text-emerald-400 mt-0.5 font-medium">{metrics.successfulRedistributions} redistributions</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Utensils className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="hover-glow">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-slate-400">Food Weight Saved</span>
                <Badge variant="default" className="text-[9px]">ESTIMATED</Badge>
              </div>
              <h3 className="text-3xl font-black text-emerald-400 mt-1">{metrics.estimatedWeightKg} kg</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Redirected from waste</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Leaf className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="hover-glow">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-slate-400">Disposal Cost Avoided</span>
                <Badge variant="default" className="text-[9px]">ESTIMATED</Badge>
              </div>
              <h3 className="text-3xl font-black text-amber-400 mt-1">${metrics.estimatedDisposalCostSavedUsd}</h3>
              <p className="text-[11px] text-amber-300 mt-0.5 font-medium">$2.50/kg saved</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="hover-glow">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400">Match Success Rate</span>
              <h3 className="text-3xl font-black text-purple-400 mt-1">{metrics.matchSuccessRate}%</h3>
              <p className="text-[11px] text-purple-300 mt-0.5 font-medium">{metrics.verifiedOrganizationsCount} verified orgs</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Rescued Meals Trend */}
        <Card title="Rescued Meals Growth Trend" subtitle="Monthly campus food redistribution output (portions)">
          <div className="mt-4 pt-2">
            <div className="flex items-end justify-between gap-3 h-48 px-2 border-b border-slate-800">
              {metrics.monthlyTrend.map((item, idx) => {
                const height = Math.round((item.mealsRescued / maxTrendMeals) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-full flex items-end justify-center h-40">
                      <div
                        style={{ height: `${height}%` }}
                        className="w-7 bg-gradient-to-t from-brand-600 to-emerald-400 rounded-t-md transition-all group-hover:brightness-110 relative"
                        title={`${item.month}: ${item.mealsRescued} meals`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 truncate">{item.month.split(" ")[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Department Contribution Breakdown */}
        <Card title="Surplus Origin by Department" subtitle="Campus department & club contributions">
          <div className="space-y-4 mt-3">
            {metrics.departmentBreakdown.map((dept, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{dept.department}</span>
                  <span className="text-brand-400 font-bold">{dept.meals} portions ({dept.count} events)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-purple-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(15, (dept.meals / (metrics.totalMealsRescued || 1)) * 100 * 5))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Estimation Disclaimer Callout */}
      <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">SDG Impact Methodology Note: </span>
          Environmental emission savings (2.5 kg CO2 per kg food) and disposal cost savings ($2.50 per kg food) are calculated as standard UNEP/FAO baseline estimates derived from verified rescued meal portion weights.
        </div>
      </div>
    </div>
  );
};
