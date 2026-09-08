"use client";

import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Download, Maximize2, Minimize2,
  Sparkles, Award, ShieldCheck, Utensils, HeartHandshake, Leaf,
  TrendingUp, Layers, CheckCircle2, FileText, ExternalLink, Presentation
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface SlideData {
  id: number;
  title: string;
  category: string;
  subtitle: string;
  content: React.ReactNode;
}

const slidesData: SlideData[] = [
  {
    id: 1,
    title: "ReServe AI — Rescue More. Waste Less.",
    category: "Title & Project Overview",
    subtitle: "Campus Food Surplus Prevention & Intelligent Redistribution Platform",
    content: (
      <div className="space-y-6 text-center py-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          1M1B – IBM SkillsBuild & AICTE AI for Sustainability Internship (2026)
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Campus Food Rescue AI Platform
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Tackling campus food waste through statistical cafeteria demand forecasting and natural language surplus redistribution to verified local shelters.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto pt-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-500 uppercase">Student Name</p>
            <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">Ilakkiyan J</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-500 uppercase">Institution</p>
            <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">Karpagam College of Engineering</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-500 uppercase">Field of Study</p>
            <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">Computer Science & Design</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "The Problem — Campus Food Waste at Scale",
    category: "Problem Definition",
    subtitle: "Over-preparation in cafeterias & unavoidable leftovers from campus events",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold mb-3">
            🍳 1
          </div>
          <h4 className="font-bold text-lg text-slate-900 dark:text-white">Cafeteria Over-Preparation</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Dining halls cook large buffer volumes to prevent running out during peak student meal hours, generating hundreds of unused meals daily due to inaccurate attendance guessing.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-3">
            🎪 2
          </div>
          <h4 className="font-bold text-lg text-slate-900 dark:text-white">Campus Event Surplus</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Workshops, club events, and conferences frequently order catered meals. Remaining food is often discarded due to lack of real-time logistics and recipient NGO coordination.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Central Question & Design Thinking Framework",
    category: "Methodology",
    subtitle: "How might we use AI to create a circular campus food ecosystem?",
    content: (
      <div className="space-y-6 py-4">
        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
          <blockquote className="text-lg font-bold text-emerald-900 dark:text-emerald-200 italic">
            "How might we use AI to predict cafeteria demand and match surplus event food with verified local rescue organizations so that campus food redistribution becomes sustainable, transparent, and efficient?"
          </blockquote>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">1. Empathize</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Interviews with mess managers & local NGOs</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">2. Define</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Dual-mode problem: Prevent + Rescue</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">3. Ideate</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Decoupled AI agents & NLP text intake</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">4. Prototype</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Next.js 14, Neon Postgres, Haversine Matrix</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "UN Sustainable Development Goals (SDGs) Alignment",
    category: "Sustainability Impact",
    subtitle: "Direct contribution to United Nations Agenda 2030",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4">
        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
          <Badge variant="success">Primary Goal</Badge>
          <h4 className="font-extrabold text-xl text-slate-900 dark:text-white mt-3">SDG 12</h4>
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">Responsible Consumption & Production</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            Target 12.3: Halve global per capita food waste by 2030 and reduce food losses along production and supply chains.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
          <Badge variant="purple">Secondary Goal</Badge>
          <h4 className="font-extrabold text-xl text-slate-900 dark:text-white mt-3">SDG 2</h4>
          <p className="text-xs font-bold text-purple-700 dark:text-purple-300 mt-0.5">Zero Hunger</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            Target 2.1: Ensure access by all people, in particular the poor and people in vulnerable situations, to safe and nutritious food.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
          <Badge variant="info">Community Impact</Badge>
          <h4 className="font-extrabold text-xl text-slate-900 dark:text-white mt-3">SDG 11</h4>
          <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mt-0.5">Sustainable Cities & Communities</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            Target 11.6: Reduce the adverse per capita environmental impact of cities, including municipal waste management.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "The Solution — Dual-Mode AI Platform",
    category: "Platform Solution",
    subtitle: "Comprehensive end-to-end food waste lifecycle intervention",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              🛡️
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">PREVENT Mode</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Demand Forecasting Engine</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Statistical regression model for cafeteria prep</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 5% safety buffer margin to eliminate shortage risk</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> MAE & RMSE accuracy evaluation loop</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              🚚
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">RESCUE Mode</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Intelligent Surplus Matching</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Natural language text & voice surplus intake</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Weighted 4-factor Haversine distance matching</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Grounded FDA food safety RAG Assistant</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "PREVENT Mode — Demand Forecasting Engine",
    category: "PREVENT Mode",
    subtitle: "Optimizing cafeteria meal preparation before cooking starts",
    content: (
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Input Variables</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">Meal Type, Scheduled Headcount, Day of Week, Academic Status (Regular/Exam/Holiday)</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase">Statistical Model</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">Linear/Polynomial Regression with baseline attendance weights & day-of-week decay</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Recommended Prep</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">Predicted Baseline × 1.05 (Strict 5% Safety Buffer) to ensure zero meal shortage</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
          📈 Feedback Loop: Logs actual consumption vs predicted quantities to calculate Mean Absolute Error (MAE) and RMSE, continuously refining forecast accuracy over time.
        </div>
      </div>
    ),
  },
  {
    id: 7,
    title: "RESCUE Mode — NLP & NGO Matching Engine",
    category: "RESCUE Mode",
    subtitle: "Zero-friction leftover intake and multi-criteria recipient scoring",
    content: (
      <div className="space-y-6 py-4">
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 uppercase">Natural Language Text Input Example:</p>
          <p className="text-sm font-mono text-emerald-700 dark:text-emerald-400 mt-1">
            "60 veg meal boxes remaining at Seminar Hall Block B until 8 PM. Contact 9876543210."
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs font-bold text-slate-400">1. Quantity</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">60 Portions</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs font-bold text-slate-400">2. Category</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">VEGETARIAN</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs font-bold text-slate-400">3. Location</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Seminar Hall B</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs font-bold text-slate-400">4. Deadline</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">8:00 PM Today</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 8,
    title: "Decoupled AI Agent Architecture",
    category: "Architecture",
    subtitle: "6 specialized, autonomous agent modules",
    content: (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">Demand Prediction</p>
          <p className="text-xs text-slate-500 mt-1">`demandPredictionAgent.ts`</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Cafeteria prep forecasting & safety buffer calculation.</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="font-bold text-sm text-teal-600 dark:text-teal-400">Surplus NLP Extractor</p>
          <p className="text-xs text-slate-500 mt-1">`surplusExtractorAgent.ts`</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Unformatted text notice parsing & field extraction.</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="font-bold text-sm text-blue-600 dark:text-blue-400">Multi-Criteria Matcher</p>
          <p className="text-xs text-slate-500 mt-1">`matchingAgent.ts`</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Haversine distance & capacity 4-factor scoring matrix.</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="font-bold text-sm text-purple-600 dark:text-purple-400">State Coordinator</p>
          <p className="text-xs text-slate-500 mt-1">`coordinationAgent.ts`</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Lifecycle tracking (Assigned ➔ In Transit ➔ Arrived ➔ Completed).</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="font-bold text-sm text-amber-600 dark:text-amber-400">Food Safety RAG</p>
          <p className="text-xs text-slate-500 mt-1">`ragAssistantAgent.ts`</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">FDA guidelines Q&A knowledge assistant.</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="font-bold text-sm text-sky-600 dark:text-sky-400">Impact Analytics</p>
          <p className="text-xs text-slate-500 mt-1">`impactAgent.ts`</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">SDG 12 metrics, CO2 savings, and cost calculations.</p>
        </div>
      </div>
    ),
  },
  {
    id: 9,
    title: "Mathematical Formulas & Matching Matrix",
    category: "Algorithm & Formulas",
    subtitle: "Deterministic 4-factor recipient scoring equation",
    content: (
      <div className="space-y-4 py-4">
        <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs overflow-x-auto">
          Score = 0.30 × CapacityScore + 0.30 × ProximityScore + 0.20 × DeadlineScore + 0.20 × ReliabilityScore
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-900 dark:text-white">Haversine Distance Formula</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-mono">
              d = 2r × arcsin(√[sin²(Δlat/2) + cos(lat1)cos(lat2)sin²(Δlon/2)])
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Proximity score decays linearly over a 0–15 km search radius.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-900 dark:text-white">Capacity & Expiration Margin</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-mono">
              CapacityScore = Min(1.0, RecipientCapacity / SurplusQuantity)
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Ensures food quantity matches recipient storage and pickup window.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 10,
    title: "Technical Implementation & Tech Stack",
    category: "Tech Stack",
    subtitle: "Modern, high-performance web architecture",
    content: (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase">Framework</p>
          <p className="font-black text-slate-900 dark:text-white text-base mt-1">Next.js 14</p>
          <p className="text-[11px] text-slate-500">App Router & Edge Middleware</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase">Database</p>
          <p className="font-black text-blue-600 dark:text-blue-400 text-base mt-1">Neon Postgres</p>
          <p className="text-[11px] text-slate-500">Serverless PostgreSQL + Prisma</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase">Language</p>
          <p className="font-black text-blue-500 text-base mt-1">TypeScript</p>
          <p className="text-[11px] text-slate-500">Strict end-to-end type safety</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase">Authentication</p>
          <p className="font-black text-emerald-600 dark:text-emerald-400 text-base mt-1">JOSE Crypto JWT</p>
          <p className="text-[11px] text-slate-500">HttpOnly cookies & Bcryptjs</p>
        </div>
      </div>
    ),
  },
  {
    id: 11,
    title: "End-to-End System Data Flow",
    category: "System Flow",
    subtitle: "From leftover reporting to recipient pickup confirmation",
    content: (
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs inline-flex items-center justify-center mb-2">1</span>
            <p className="font-bold text-xs text-slate-900 dark:text-white">Surplus Intake</p>
            <p className="text-[11px] text-slate-500 mt-1">Event Mgr reports food via text notice or form.</p>
          </div>
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs inline-flex items-center justify-center mb-2">2</span>
            <p className="font-bold text-xs text-slate-900 dark:text-white">AI Matching</p>
            <p className="text-[11px] text-slate-500 mt-1">Matching agent scores verified local NGOs 0-100.</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs inline-flex items-center justify-center mb-2">3</span>
            <p className="font-bold text-xs text-slate-900 dark:text-white">NGO Response</p>
            <p className="text-[11px] text-slate-500 mt-1">Recipient NGO accepts or rejects match proposal.</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
            <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs inline-flex items-center justify-center mb-2">4</span>
            <p className="font-bold text-xs text-slate-900 dark:text-white">Pickup Tracker</p>
            <p className="text-[11px] text-slate-500 mt-1">State machine coordinates transit to completion.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 12,
    title: "IBM Responsible AI & Ethical Framework",
    category: "AI Ethics",
    subtitle: "Fairness, Explainability, and Human-in-the-Loop Safeguards",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">1. Objective Fairness</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Matching evaluates deterministic Haversine distance, capacity, and deadlines to eliminate bias toward specific shelters.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <p className="font-bold text-sm text-teal-600 dark:text-teal-400">2. Full Explainability</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Every match proposal displays a 0–100 score with a human-readable factor breakdown explaining the exact choice.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <p className="font-bold text-sm text-blue-600 dark:text-blue-400">3. Zero Hallucinations</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Matching operates exclusively on active, verified organizations (`verificationStatus === "VERIFIED"`).
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 13,
    title: "Expected Sustainability Impact Metrics",
    category: "Impact",
    subtitle: "Quantifiable annual campus sustainability metrics",
    content: (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">15,000+</p>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Meals Rescued</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Redirected to local pantries</p>
        </div>

        <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center">
          <p className="text-2xl font-black text-teal-600 dark:text-teal-400">6.2 MT</p>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">CO₂ Avoided</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Calculated per UNEP standards</p>
        </div>

        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">$15,000+</p>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Hauling Saved</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Campus disposal fee savings</p>
        </div>

        <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center">
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">18%</p>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Waste Reduction</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Average cafeteria over-prep drop</p>
        </div>
      </div>
    ),
  },
  {
    id: 14,
    title: "Stakeholder Benefits Matrix",
    category: "Stakeholders",
    subtitle: "Value creation across campus dining, student clubs, and local NGOs",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="font-bold text-sm text-slate-900 dark:text-white">👨‍🍳 Mess & Cafeteria Managers</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Accurate daily prep forecasts, 5% safety margin, zero food shortage risk.</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="font-bold text-sm text-slate-900 dark:text-white">🎪 Event Coordinators</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Zero-friction surplus reporting via plain text notices or instant form.</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="font-bold text-sm text-slate-900 dark:text-white">🏢 Recipient Organizations</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Automated alerts for fresh local surplus food with pickup coordination.</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="font-bold text-sm text-slate-900 dark:text-white">🛡️ Campus Sustainability Officers</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">System-wide SDG 12 analytics, verified NGO registry, and compliance logs.</p>
        </div>
      </div>
    ),
  },
  {
    id: 15,
    title: "Conclusion & Circular Campus Ecosystem",
    category: "Conclusion",
    subtitle: "Transforming campus food systems into zero-waste circular networks",
    content: (
      <div className="space-y-6 py-4 text-center">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-200 dark:border-emerald-800">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Toward Zero-Waste University Campuses
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-xl mx-auto leading-relaxed">
            ReServe AI proves that combining statistical demand prediction with AI surplus matching creates a scalable, transparent, and circular campus food ecosystem.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <span>✓ Open Source MIT License</span>
          <span>•</span>
          <span>✓ Scalable to any campus</span>
          <span>•</span>
          <span>✓ Neon Postgres Cloud Synced</span>
        </div>
      </div>
    ),
  },
  {
    id: 16,
    title: "Thank You & Presentation Deck Download",
    category: "Thank You",
    subtitle: "1M1B IBM SkillsBuild AI + Sustainability Internship 2026",
    content: (
      <div className="space-y-6 text-center py-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-black text-2xl shadow-lg">
          R
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Thank You for Reviewing ReServe AI!
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          You can download the full PowerPoint deck file or explore the live platform app dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="/ReServe-AI-Rescue-More-Waste-Less.pptx"
            download="ReServe-AI-Rescue-More-Waste-Less.pptx"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download .pptx File (37.5 MB)
          </a>
        </div>
      </div>
    ),
  },
];

export const SlideDeckViewer: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentSlide = slidesData[currentSlideIndex];
  const totalSlides = slidesData.length;

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? "fixed inset-0 z-50 bg-slate-900 p-6 overflow-y-auto" : ""}`}>
      
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="text-xs">Slide {currentSlide.id} of {totalSlides}</Badge>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{currentSlide.category}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            {currentSlide.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentSlide.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/ReServe-AI-Rescue-More-Waste-Less.pptx"
            download="ReServe-AI-Rescue-More-Waste-Less.pptx"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" /> Download .pptx
          </a>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
            title="Toggle fullscreen slide view"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide Display Area */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-lg min-h-[380px] flex flex-col justify-between relative overflow-hidden">
        
        {/* Top subtle line */}
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 absolute top-0 left-0 right-0" />

        {/* Slide Content */}
        <div className="my-auto">
          {currentSlide.content}
        </div>

        {/* Slide Footer controls */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4 mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-2">
              Slide {currentSlideIndex + 1} / {totalSlides}
            </span>
          </div>

          {/* Quick Slide Dots/Picker */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
            {slidesData.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-6 h-6 rounded-md text-[11px] font-bold transition-all ${
                  idx === currentSlideIndex
                    ? "bg-emerald-600 text-white scale-110 shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {s.id}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
