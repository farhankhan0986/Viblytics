"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Link2, Clock, X } from "lucide-react";

const STORAGE_KEY = "vm-recent-channel";

interface Props {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  onSuccess?: (url: string) => void; // called by parent after successful fetch
}

// Parent saves recent via prop callback; but we also expose a static helper
// so DashboardContainer can call it after a successful response.
export function saveRecentChannel(url: string) {
  try { localStorage.setItem(STORAGE_KEY, url); } catch {}
}

export function ChannelInput({ onAnalyze, isLoading }: Props) {
  const [url, setUrl]           = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recent, setRecent]     = useState<string | null>(null);

  // Read recent channel on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecent(stored);
    } catch {}
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;
    onAnalyze(url.trim());
  };

  const useRecent = () => {
    if (!recent) return;
    setUrl(recent);
    onAnalyze(recent);
  };

  const clearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setRecent(null);
  };

  // Derive a display label from the stored URL
  const recentLabel = recent
    ? recent.replace(/^https?:\/\/(www\.)?youtube\.com\//i, "").replace(/^@/, "@")
    : null;

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
        {/* Input */}
        <div
          className={`relative flex flex-1 items-center rounded-2xl bg-white dark:bg-slate-800 shadow-sm transition-all duration-200 ${
            isFocused
              ? "ring-2 ring-indigo-500 shadow-md shadow-indigo-100 dark:shadow-indigo-900/30"
              : "ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-slate-300 dark:hover:ring-slate-600"
          }`}
        >
          <div className="pointer-events-none absolute left-4 flex items-center">
            <Link2 className="h-5 w-5 text-indigo-400" />
          </div>
          <input
            id="channel-url-input"
            type="text"
            autoComplete="off"
            spellCheck={false}
            className="block w-full rounded-2xl border-0 bg-transparent py-4 pl-11 pr-4 text-base sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 outline-none"
            placeholder="youtube.com/@mkbhd or channel URL…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            aria-label="YouTube channel URL"
          />
        </div>

        {/* Analyze button */}
        <button
          id="analyze-btn"
          type="submit"
          disabled={isLoading || !url.trim()}
          className={`
            relative inline-flex items-center justify-center gap-2.5 rounded-2xl px-7 py-4 text-sm font-semibold transition-all duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
            ${isLoading || !url.trim()
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
              : "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-95"
            }
          `}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {isLoading ? "Analyzing…" : "Analyze Channel"}
        </button>
      </form>

      {/* Recent channel chip */}
      {recent && !isLoading && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 dark:text-slate-500">Recent:</span>
          <button
            onClick={useRecent}
            className="group inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 pl-2.5 pr-1.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-700 dark:hover:text-indigo-300 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-indigo-200 dark:hover:ring-indigo-800 transition-all duration-150"
            title={`Re-analyze ${recent}`}
          >
            <Clock className="h-3 w-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <span className="max-w-[200px] truncate">{recentLabel}</span>
            <span
              role="button"
              onClick={clearRecent}
              className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Clear recent"
            >
              <X className="h-2.5 w-2.5" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
