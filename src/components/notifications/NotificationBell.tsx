"use client";

import React, { useState, useEffect } from "react";
import { Bell, CheckCircle2, AlertTriangle, Truck, Sparkles, X } from "lucide-react";
import { SystemNotification } from "@/lib/ai/coordinationAgent";

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success && data.data) {
        setNotifications(data.data);
        setUnreadCount(data.data.length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 8000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "MATCH_ACCEPTED":
      case "RESCUE_COMPLETED":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "MATCH_REJECTED":
      case "EXPIRATION_WARNING":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "PICKUP_ASSIGNED":
      case "STATUS_UPDATE":
        return <Truck className="w-4 h-4 text-sky-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setIsOpen(!isOpen); setUnreadCount(0); }}
        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
        title="System Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-400 animate-ping" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel p-4 rounded-xl shadow-2xl border border-slate-800 z-50 animate-fade-in">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-400" /> Notifications & Alerts
            </h4>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2 pr-1 text-xs">
            {notifications.length === 0 ? (
              <p className="text-slate-500 text-center py-6">No recent system notifications.</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-800/80 flex items-start gap-2.5">
                  <div className="mt-0.5">{getIcon(n.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{n.title}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
