import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "ReServe AI — Rescue More. Waste Less.",
  description: "Campus Food Rescue AI — Preventing cafeteria food surplus & redistributing event meals to verified recipient organizations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
