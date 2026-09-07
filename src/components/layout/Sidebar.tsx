"use client";

import React from "react";
import { UserRole } from "@/types";
import {
  LayoutDashboard, Calendar, Utensils, Sparkles,
  Truck, BarChart3, BookOpen, ShieldCheck, ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  roles: UserRole[];
  section: string;
}

const navItems: NavItem[] = [
  {
    id: "overview",
    label: "Dashboard",
    description: "Overview & key metrics",
    icon: LayoutDashboard,
    roles: ["ADMIN", "CAFETERIA_MANAGER", "EVENT_MANAGER", "RECIPIENT_ORGANIZATION"],
    section: "core",
  },
  {
    id: "prevent",
    label: "Demand Forecast",
    description: "PREVENT: Cafeteria prediction",
    icon: Utensils,
    roles: ["ADMIN", "CAFETERIA_MANAGER"],
    section: "prevent",
  },
  {
    id: "events",
    label: "Events & Surplus",
    description: "RESCUE: Report surplus food",
    icon: Calendar,
    roles: ["ADMIN", "EVENT_MANAGER", "CAFETERIA_MANAGER"],
    section: "rescue",
  },
  {
    id: "matching",
    label: "AI Matcher",
    description: "Find recipient organizations",
    icon: Sparkles,
    roles: ["ADMIN", "EVENT_MANAGER", "CAFETERIA_MANAGER", "RECIPIENT_ORGANIZATION"],
    section: "rescue",
  },
  {
    id: "pickups",
    label: "Pickup Coordination",
    description: "Track pickup lifecycle",
    icon: Truck,
    roles: ["ADMIN", "EVENT_MANAGER", "RECIPIENT_ORGANIZATION"],
    section: "rescue",
  },
  {
    id: "impact",
    label: "Impact Analytics",
    description: "SDG 12 & SDG 2 metrics",
    icon: BarChart3,
    roles: ["ADMIN", "CAFETERIA_MANAGER", "EVENT_MANAGER", "RECIPIENT_ORGANIZATION"],
    section: "insights",
  },
  {
    id: "rag",
    label: "AI Assistant",
    description: "Food safety knowledge Q&A",
    icon: BookOpen,
    roles: ["ADMIN", "CAFETERIA_MANAGER", "EVENT_MANAGER", "RECIPIENT_ORGANIZATION"],
    section: "insights",
  },
  {
    id: "admin",
    label: "Recipient Registry",
    description: "Verify & manage organizations",
    icon: ShieldCheck,
    roles: ["ADMIN"],
    section: "admin",
  },
];

const sectionLabels: Record<string, string> = {
  core:     "Overview",
  prevent:  "Prevent Mode",
  rescue:   "Rescue Mode",
  insights: "Analytics",
  admin:    "Administration",
};

const roleDisplayNames: Record<UserRole, string> = {
  ADMIN: "Campus Admin",
  CAFETERIA_MANAGER: "Cafeteria Manager",
  EVENT_MANAGER: "Event Manager",
  RECIPIENT_ORGANIZATION: "Recipient Org",
};

const roleBadgeColors: Record<UserRole, string> = {
  ADMIN: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  CAFETERIA_MANAGER: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  EVENT_MANAGER: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  RECIPIENT_ORGANIZATION: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, activeTab, onTabChange }) => {
  const filtered = navItems.filter((item) => item.roles.includes(currentRole));

  // Group into sections preserving order
  const sections: Record<string, NavItem[]> = {};
  for (const item of filtered) {
    if (!sections[item.section]) sections[item.section] = [];
    sections[item.section].push(item);
  }

  return (
    <aside className="w-64 glass-panel border-r border-slate-200 dark:border-slate-800 flex flex-col min-h-[calc(100vh-65px)] sticky top-[65px] self-start">
      {/* Role indicator */}
      <div className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-800/60">
        <div className={clsx(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold",
          roleBadgeColors[currentRole]
        )}>
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
          {roleDisplayNames[currentRole]}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {Object.entries(sections).map(([sectionKey, items]) => (
          <div key={sectionKey}>
            <p className="px-2 mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {sectionLabels[sectionKey]}
            </p>
            <div className="space-y-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={clsx(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left group transition-all duration-150",
                      isActive
                        ? "bg-brand-600/10 dark:bg-brand-500/15 border border-brand-500/25 shadow-sm"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent"
                    )}
                  >
                    <div className={clsx(
                      "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                      isActive
                        ? "bg-brand-500/20 text-brand-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    )}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={clsx(
                        "text-sm font-medium leading-tight truncate",
                        isActive ? "text-brand-400 dark:text-brand-300" : "text-slate-700 dark:text-slate-200"
                      )}>
                        {item.label}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-3 h-3 text-brand-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-200/50 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-[11px] text-slate-500">Production Build v1.1</p>
        </div>
        <p className="text-[10px] text-slate-600 mt-0.5">SDG 12 & SDG 2 Aligned</p>
      </div>
    </aside>
  );
};
