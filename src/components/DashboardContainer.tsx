"use client";

import { useState } from "react";
import { ChannelInput, saveRecentChannel } from "@/components/ChannelInput";
import { Dashboard } from "@/components/Dashboard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { AnalyzeResponse } from "@/types";
import { AlertCircle, BarChart2, Search, TrendingUp } from "lucide-react";

const FEATURE_PILLS = [
  { icon: Search, label: "Any public channel" },
  { icon: TrendingUp, label: "Last 30 days" },
  { icon: BarChart2, label: "Live metrics" },
];

export function DashboardContainer() {
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to analyze channel");
      }
      const json = await res.json();
      setData(json);
      saveRecentChannel(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const showHero = !data && !isLoading;

  return (
    <div className="flex w-full flex-col items-center">
      {/* Hero */}
      <section className={`w-full relative overflow-hidden bg-white dark:bg-slate-900 transition-all duration-500 ease-in-out ${showHero ? "py-24 md:py-32" : "py-10 border-b border-slate-200 dark:border-slate-800"}`}>
        {showHero && (
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{ backgroundImage: "linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)", backgroundSize: "40px 40px" }}
          />
        )}

        <div className="relative mx-auto max-w-3xl px-4 text-center">
          {showHero && (
            <>
              <div className="mb-8 flex flex-wrap justify-center gap-2">
                {FEATURE_PILLS.map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-100 dark:ring-indigo-900">
                    <Icon className="h-3.5 w-3.5" />{label}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-[56px] leading-[1.1]">
                Analyze Competitor<br />
                <span className="text-indigo-600 dark:text-indigo-400">Video Performance</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                Paste any YouTube channel URL to instantly surface their best-performing videos from the past 30 days.
              </p>
            </>
          )}

          <div className={showHero ? "mt-10" : ""}>
            <ChannelInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 px-4 py-3.5 text-left ring-1 ring-rose-200 dark:ring-rose-900">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
              <p className="text-sm font-medium text-rose-700 dark:text-rose-400">{error}</p>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
        {isLoading ? (
          <LoadingSkeleton />
        ) : data ? (
          <Dashboard data={data} />
        ) : !error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 ring-1 ring-indigo-100 dark:ring-indigo-900">
              <BarChart2 className="h-8 w-8 text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No channel analyzed yet</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-400 dark:text-slate-500 leading-relaxed">
              Paste a YouTube channel URL above to see video performance, trending content, and key metrics.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
