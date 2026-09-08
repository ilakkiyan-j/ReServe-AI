"use client";

import React, { useState, useEffect } from "react";
import { Leaf, Sun, Moon, LogIn, LogOut, ShieldCheck, User } from "lucide-react";
import { UserRole, UserSession } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { AuthModal } from "@/components/auth/AuthModal";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onGoToLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, onRoleChange, onGoToLanding }) => {
  const [isDark, setIsDark] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    // Fetch active session on mount
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.user) {
          setCurrentUser(data.data.user);
          onRoleChange(data.data.user.role);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user: UserSession) => {
    setCurrentUser(user);
    onRoleChange(user.role);
  };

  const roleColors: Record<UserRole, "purple" | "success" | "info" | "warning"> = {
    ADMIN: "purple",
    CAFETERIA_MANAGER: "success",
    EVENT_MANAGER: "info",
    RECIPIENT_ORGANIZATION: "warning",
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 backdrop-blur-md px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Header */}
          <div
            onClick={onGoToLanding}
            className="flex items-center gap-3 cursor-pointer group"
            title={onGoToLanding ? "Go to Landing Page" : undefined}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 font-black text-xl group-hover:scale-105 transition-transform">
              R
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                ReServe <span className="text-brand-500 font-black">AI</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block -mt-0.5">
                Rescue More. Waste Less.
              </span>
            </div>
          </div>

          {/* User Session & Role Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {onGoToLanding && (
              <button
                onClick={onGoToLanding}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
              >
                🌐 Landing Page
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{currentUser.email}</p>
                  </div>
                </div>
                <Badge variant={roleColors[currentUser.role]}>{currentUser.role.replace("_", " ")}</Badge>
                <button
                  onClick={handleLogout}
                  className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" /> Sign In / Register
                </button>
                <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Role:</span>
                  <select
                    value={currentRole}
                    onChange={(e) => onRoleChange(e.target.value as UserRole)}
                    className="bg-transparent text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
                  >
                    <option value="ADMIN" className="bg-white dark:bg-slate-900">Admin</option>
                    <option value="CAFETERIA_MANAGER" className="bg-white dark:bg-slate-900">Cafeteria Manager</option>
                    <option value="EVENT_MANAGER" className="bg-white dark:bg-slate-900">Event Manager</option>
                    <option value="RECIPIENT_ORGANIZATION" className="bg-white dark:bg-slate-900">Recipient Org</option>
                  </select>
                </div>
              </div>
            )}

            <NotificationBell />

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title="Toggle light/dark theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleAuthSuccess}
      />
    </>
  );
};
