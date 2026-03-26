"use client";

import { BarChart3, Moon, Sun, Activity } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 dark:bg-slate-900/90 dark:border-slate-800/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 md:px-6">

        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Icon mark with glow */}
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-indigo-500 opacity-20 blur-md" />
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-300/40 dark:shadow-indigo-900/50">
              <BarChart3 className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Wordmark */}
          <div className="flex flex-col leading-none gap-2">
            <span className="text-[18px] font-extrabold tracking-tight text-slate-900 dark:text-white">
              Viblytics
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <Activity className="h-2.5 w-2.5" />
              YouTube Analytics
            </span>
          </div>
        </div>

        {/* ── Right controls ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2.5">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 ring-1 ring-emerald-200/80 dark:ring-emerald-800/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Live</span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="group flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-indigo-200 dark:hover:ring-indigo-800 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {theme === "dark"
              ? <Sun className="h-[18px] w-[18px] transition-transform group-hover:rotate-12 duration-150" />
              : <Moon className="h-[18px] w-[18px] transition-transform group-hover:-rotate-12 duration-150" />}
          </button>
        </div>
      </div>
    </header>
  );
}
