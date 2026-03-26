"use client";

import { BarChart3, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/70 dark:bg-slate-900/80 dark:border-slate-800/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 shadow-sm shadow-indigo-200">
            <BarChart3 className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white">VidMetrics</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 ring-1 ring-emerald-200 dark:ring-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Live data</span>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {theme === "dark"
              ? <Sun className="h-4 w-4" />
              : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
