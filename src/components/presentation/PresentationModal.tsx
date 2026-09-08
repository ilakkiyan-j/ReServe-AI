"use client";

import React, { useState } from "react";
import { X, Download, FileText, ExternalLink, Presentation, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pptUrl = "/ReServe-AI-Rescue-More-Waste-Less.pptx";
  const livePptUrl = "https://re-serve-ai.vercel.app/ReServe-AI-Rescue-More-Waste-Less.pptx";
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(livePptUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                ReServe AI — Master Presentation Deck
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                1M1B IBM SkillsBuild AI + Sustainability Internship (16 Slides)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pptUrl}
              download="ReServe-AI-Rescue-More-Waste-Less.pptx"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" /> Download .pptx
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Direct Download Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-200 dark:border-orange-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-orange-600 dark:text-orange-400 shrink-0" />
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  ReServe-AI-Rescue-More-Waste-Less.pptx
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Full 16-Slide PowerPoint Presentation File (37.5 MB)
                </p>
              </div>
            </div>
            <a
              href={pptUrl}
              download="ReServe-AI-Rescue-More-Waste-Less.pptx"
              className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" /> Download File Now
            </a>
          </div>

          {/* Embedded Office Viewer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Live Web Slide Viewer
              </span>
              <a
                href={officeViewerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
              >
                Open full screen <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="w-full h-[480px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
              <iframe
                src={officeViewerUrl}
                className="w-full h-full border-none"
                title="ReServe AI Presentation Deck"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Student: <strong>Ilakkiyan J</strong> (Karpagam College of Engineering)</span>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>

      </div>
    </div>
  );
};
