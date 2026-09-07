"use client";

import React, { useState } from "react";
import { UserRole } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Lock, Mail, User, ShieldCheck, X, Zap } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("EVENT_MANAGER");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = tab === "login" ? { email, password } : { name, email, password, role };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      onLoginSuccess(data.data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: "password123" }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Demo login failed");
      }

      onLoginSuccess(data.data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md">
        <Card className="relative p-6 bg-slate-900/95 border-slate-800 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">Authentication & RBAC</h2>
            </div>
            <p className="text-xs text-slate-400">Sign in to access your authorized role dashboard.</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-slate-800 mb-5">
            <button
              onClick={() => { setTab("login"); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-colors ${
                tab === "login" ? "border-brand-500 text-brand-400" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-colors ${
                tab === "register" ? "border-brand-500 text-brand-400" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Register New Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "register" && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@campus.edu"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {tab === "register" && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assign User Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="EVENT_MANAGER">Event Organizer</option>
                  <option value="CAFETERIA_MANAGER">Mess / Cafeteria Manager</option>
                  <option value="RECIPIENT_ORGANIZATION">Verified Recipient Org</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
              {tab === "login" ? "Sign In to System" : "Create Account & Login"}
            </Button>
          </form>

          {/* Quick Fast-Login for Seed Accounts */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> One-Click Seed Account Login
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleDemoLogin("admin@campusfoodrescue.ai", "ADMIN")}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-left transition-colors"
              >
                <Badge variant="purple" className="text-[9px]">ADMIN</Badge>
                <p className="text-[11px] text-slate-200 mt-1 font-medium truncate">Campus Admin</p>
              </button>

              <button
                onClick={() => handleDemoLogin("messmanager@campus.edu", "CAFETERIA_MANAGER")}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-left transition-colors"
              >
                <Badge variant="success" className="text-[9px]">CAFETERIA</Badge>
                <p className="text-[11px] text-slate-200 mt-1 font-medium truncate">Mess Manager</p>
              </button>

              <button
                onClick={() => handleDemoLogin("events@studentclub.edu", "EVENT_MANAGER")}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-left transition-colors"
              >
                <Badge variant="info" className="text-[9px]">EVENT</Badge>
                <p className="text-[11px] text-slate-200 mt-1 font-medium truncate">Alex Event Org</p>
              </button>

              <button
                onClick={() => handleDemoLogin("contact@carehope.org", "RECIPIENT_ORGANIZATION")}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-left transition-colors"
              >
                <Badge variant="warning" className="text-[9px]">RECIPIENT</Badge>
                <p className="text-[11px] text-slate-200 mt-1 font-medium truncate">Care Hope Shelter</p>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
