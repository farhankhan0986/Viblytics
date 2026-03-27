"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChannelInput, saveRecentChannel } from "@/components/ChannelInput";
import { Dashboard } from "@/components/Dashboard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { AnalyzeResponse } from "@/types";
import { AlertCircle, BarChart2, Search, TrendingUp, Zap, Loader2 } from "lucide-react";
import Image from "next/image";

const FEATURE_PILLS = [
  { icon: Search, label: "Any public channel" },
  { icon: TrendingUp, label: "Last 90 days" },
  { icon: BarChart2, label: "Live metrics" },
  { icon: Zap, label: "AI-style insights" },
];

const EXAMPLE_CHANNELS = [
  { label: "@mkbhd", url: "https://youtube.com/@mkbhd" },
  { label: "@MrBeast", url: "https://youtube.com/@MrBeast" },
  { label: "@veritasium", url: "https://youtube.com/@veritasium" },
  { label: "@fireship", url: "https://youtube.com/@fireship" },
  { label: "@LinusTech", url: "https://youtube.com/@LinusTechTips" },
];

// ── Inner component that reads search params ───────────────────────────────
function DashboardContainerInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(() => !!searchParams.get("channel"));
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    // Push ?channel= to URL for shareability
    router.push(`?channel=${encodeURIComponent(url)}`, { scroll: false });

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
  }, [router]);

  // Auto-analyze if ?channel= is in URL on load
  useEffect(() => {
    const ch = searchParams.get("channel");
    if (ch && !data) {
      handleAnalyze(ch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const showHero = !data && !isLoading;

  return (
    <div className="flex w-full flex-col items-center">
      {/* Hero */}
      <section className={`w-full relative overflow-hidden transition-all duration-500 ease-in-out ${showHero ? "py-24 md:py-32 bg-white dark:bg-slate-900" : "py-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"}`}>
        {showHero && (
          <>
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
              <div className="relative flex items-center justify-center">
                {/* <div className="absolute inset-0 rounded-xl bg-indigo-500/20 dark:bg-indigo-400/20 blur-md" /> */}

                <Image
                  src="/icon.svg"
                  alt="Viblytics Logo"
                  width={90}
                  height={90}
                  className="relative z-10 w-16 h-16 sm:w-[90px] sm:h-[90px]"
                />
              </div>
            </div>
            {/* Radial glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.18),transparent)]" />
            {/* Dot grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
              style={{ backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)", backgroundSize: "32px 32px" }}
            />
          </>
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
                Analyze Competitor{" "}
                <span className="text-indigo-600 dark:text-indigo-400">Video Performance</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                Paste any YouTube channel URL to surface top-performing videos, engagement insights, and content trends.
              </p>
            </>
          )}

          <div className={showHero ? "mt-10" : ""}>
            <ChannelInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>

          {/* Example channel quick-fill buttons */}
          {showHero && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">Try:</span>
              {EXAMPLE_CHANNELS.map(({ label, url }) => (
                <button
                  key={label}
                  onClick={() => handleAnalyze(url)}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-700 dark:hover:text-indigo-300 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-indigo-200 dark:hover:ring-indigo-800 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {label}
                </button>
              ))}
            </div>
          )}

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
              Paste a URL above or click one of the quick-start channels to see live video performance data.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

// ── Wrapped in Suspense for useSearchParams ────────────────────────────────
export function DashboardContainer() {
  const fallback = null;
  /* const fallback = (
    <div className="flex w-full flex-col items-center justify-center py-24">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-100/50 dark:ring-indigo-800/50 shadow-sm">
          {/* <Loader2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400 animate-spin" /> *\/}
        </div>
        {/* <div className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">Initializing dashboard...</div> *\/}
      </div>
    </div>
  ); */
  return (
    <Suspense fallback={fallback}>
      <DashboardContainerInner />
    </Suspense>
  );
}
