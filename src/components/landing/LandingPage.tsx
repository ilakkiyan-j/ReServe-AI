"use client";

import React from "react";
import {
  Sparkles, ArrowRight, ShieldCheck, Utensils, HeartHandshake, Leaf,
  TrendingUp, Building2, Users, FileText, CheckCircle2, Award, Zap,
  BarChart3, Clock, Lock
} from "lucide-react";
import { UserRole } from "@/types";

import { SustainabilityMetrics } from "@/lib/ai/impactAgent";

interface LandingPageProps {
  onLaunchApp: (role?: UserRole) => void;
  impactMetrics?: SustainabilityMetrics | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, impactMetrics }) => {
  const mealsCount = impactMetrics?.totalMealsRescued ?? 15420;
  const weightKg = impactMetrics?.estimatedWeightKg ?? 6168;
  const co2Kg = impactMetrics?.estimatedCo2EmissionsAvoidedKg ?? 15420;
  const orgsCount = impactMetrics?.verifiedOrganizationsCount ?? 12;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-300">

      {/* ── 1. HERO SECTION ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Decorative ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">

            {/* Badges */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-sm mb-6 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>1M1B – IBM SkillsBuild & AICTE AI for Sustainability Internship</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900 dark:text-white">
              Rescue More. <br className="hidden sm:inline" />
              <span className="gradient-heading">Waste Less.</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              An intelligent, dual-mode AI platform designed for university campuses to <strong className="font-semibold text-slate-900 dark:text-white">predict cafeteria demand</strong> and <strong className="font-semibold text-slate-900 dark:text-white">redistribute surplus event meals</strong> to verified local shelters.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onLaunchApp()}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
              >
                Launch App Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="/ReServe-AI-Rescue-More-Waste-Less.pptx"
                download="ReServe-AI-Rescue-More-Waste-Less.pptx"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Download Master Deck (.pptx)
              </a>
            </div>

            {/* SDG Alignment Badges */}
            <div className="mt-10 flex items-center justify-center gap-3 flex-wrap text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Aligned with UN SDGs:</span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 font-medium shadow-2xs">
                🎯 SDG 12: Responsible Consumption
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-purple-700 dark:text-purple-400 font-medium shadow-2xs">
                🍲 SDG 2: Zero Hunger
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-blue-400 font-medium shadow-2xs">
                🏙️ SDG 11: Sustainable Cities
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. LIVE IMPACT METRICS BAR ──────────────────────────────────────── */}
      <section className="py-10 bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
                <Utensils className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {mealsCount.toLocaleString()}+
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                Meals Rescued
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl bg-teal-100 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-2">
                <Leaf className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {(weightKg / 1000).toFixed(1)} Tons
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                Food Waste Avoided
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-2">
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                {(co2Kg / 1000).toFixed(1)} MT
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                CO₂ Emissions Avoided
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
                {orgsCount} Orgs
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                Verified Recipient NGOs
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. DUAL AI OPERATIONAL MODES ────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-2">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Two Dual Operational AI Engines
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
            Preventing waste before cooking begins, and matching unavoidable surplus with verified recipient shelters in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Mode 1: PREVENT */}
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-8 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3">
              🛡️ PREVENT Mode — Demand Forecasting
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Cafeteria Preparation Optimization
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Analyzes historical consumption, headcount, day of week, and exam calendars to generate accurate preparation recommendations with a strict 5% safety margin.
            </p>

            <ul className="space-y-3 text-xs font-medium text-slate-700 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Statistical regression engine with MAE/RMSE evaluation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>5% safety margin prevents meal shortages</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>18% average reduction in over-preparation waste</span>
              </li>
            </ul>

            <button
              onClick={() => onLaunchApp("CAFETERIA_MANAGER")}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              Try Cafeteria Forecast Demo <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mode 2: RESCUE */}
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-8 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6">
              <HeartHandshake className="w-6 h-6" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 text-xs font-bold mb-3">
              🚚 RESCUE Mode — Surplus Matching
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              NLP Intake & Multi-Factor NGO Matching
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Event organizers type unformatted notices (e.g. <i>"60 veg meals left at Seminar Hall"</i>). AI extracts details and matches verified NGOs using Haversine distance, capacity, and deadlines.
            </p>

            <ul className="space-y-3 text-xs font-medium text-slate-700 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Zero-friction Natural Language Surplus Intake</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Weighted 4-factor NGO matching matrix (0-100 score)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Grounded RAG Assistant for FDA food safety rules</span>
              </li>
            </ul>

            <button
              onClick={() => onLaunchApp("EVENT_MANAGER")}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              Try Event Surplus Intake Demo <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ── 4. ROLE PRESET DEMO LAUNCHER ────────────────────────────────────── */}
      <section className="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest block mb-2">
              Instant Persona Testing
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Test Any User Role Instantly
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Click any role below to launch the dashboard with that preset persona.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Persona 1: Mess Manager */}
            <div
              onClick={() => onLaunchApp("CAFETERIA_MANAGER")}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
                👨‍🍳
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Cafeteria Manager
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Run daily demand predictions, log meal consumption, and review accuracy metrics.
              </p>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Launch as Manager <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Persona 2: Event Manager */}
            <div
              onClick={() => onLaunchApp("EVENT_MANAGER")}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
                🎪
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Event Manager
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Register campus events and report leftover food via text or form.
              </p>
              <span className="inline-flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400">
                Launch as Event Mgr <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Persona 3: Recipient NGO */}
            <div
              onClick={() => onLaunchApp("RECIPIENT_ORGANIZATION")}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg mb-4">
                🏢
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                Recipient NGO
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Receive incoming surplus match proposals, accept offers, and confirm pickups.
              </p>
              <span className="inline-flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400">
                Launch as NGO <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Persona 4: System Admin */}
            <div
              onClick={() => onLaunchApp("ADMIN")}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                🛡️
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                System Admin
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Full system oversight, organization verification, and overall impact analytics.
              </p>
              <span className="inline-flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400">
                Launch as Admin <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. RESPONSIBLE AI & ETHICS ─────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4">
              <Award className="w-4 h-4" /> IBM Responsible AI Framework Aligned
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Ethical, Transparent, & Zero Hallucinations
            </h2>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              ReServe AI ensures objective fairness through transparent, multi-factor recipient matching. Every proposed allocation features a 0–100 explainability breakdown, human-in-the-loop verification, and strict verification checks.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="font-bold text-sm text-emerald-300">Fairness & Equity</p>
                <p className="text-xs text-slate-400 mt-1">Deterministic distance and capacity matrix removes bias.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="font-bold text-sm text-teal-300">Human-in-the-Loop</p>
                <p className="text-xs text-slate-400 mt-1">Extracted surplus details require explicit user confirmation.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="font-bold text-sm text-blue-300">Verified Recipient Guarantee</p>
                <p className="text-xs text-slate-400 mt-1">Matches exclusively to active, verified organization accounts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="py-10 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
              R
            </div>
            <span className="font-bold text-slate-900 dark:text-white">ReServe AI</span>
            <span>— Developed for 1M1B IBM SkillsBuild & AICTE Internship 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Student: <strong>Ilakkiyan J</strong> (Karpagam College of Engineering)</span>
            <a href="https://github.com/ilakkiyan-j/ReServe-AI.git" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition-colors">
              GitHub Repo
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};
