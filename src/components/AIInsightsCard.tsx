"use client";

import { AIInsights } from "@/types";
import { Cpu, Sparkles, Brain, Lightbulb, Target, Loader2, AlertCircle, ChevronRight } from "lucide-react";

// ── Loading skeleton ───────────────────────────────────────────────────────
function AILoadingSkeleton() {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-md shadow-indigo-100/50 dark:shadow-indigo-900/20 ring-1 ring-indigo-200/60 dark:ring-indigo-800/40">
      {/* Header */}
      <div className="relative flex items-center gap-4 px-6 py-5 bg-linear-to-r from-indigo-600 to-violet-600 overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full" style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
        
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/30 overflow-hidden p-[1.5px]">
          <div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,rgba(255,255,255,0)_70%,rgba(255,255,255,0.8)_100%)]" />
          <div className="absolute inset-[1.5px] rounded-[10px] bg-indigo-600/90 backdrop-blur-sm" />
          <Loader2 className="relative z-10 h-5 w-5 text-white animate-spin" />
        </div>
        
        <div className="relative">
          <p className="text-[15px] font-bold text-white flex items-center gap-1.5 leading-none">
            Generating Analysis
            <span className="flex items-center gap-0.5 ml-1">
              <span className="h-1 w-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-1 w-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-1 w-1 bg-white rounded-full animate-bounce"></span>
            </span>
          </p>
          <p className="text-[11px] text-indigo-200 mt-1.5 font-medium tracking-wide uppercase">Thinking with LLaMA 3.3 70B</p>
        </div>
        <div className="relative ml-auto hidden sm:flex gap-1.5 opacity-70">
          {[0, 200, 400].map(d => (
            <span key={d} className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
      {/* Shimmer body */}
      <div className="bg-white dark:bg-slate-900 px-6 py-6 space-y-3.5 animate-pulse">
        <div className="h-4 w-3/4 rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="h-4 w-5/6 rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="mt-5 grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-16 rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-3 w-4/5 rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Section column ─────────────────────────────────────────────────────────
function InsightSection({
  icon: Icon, label, items, iconColor, dotColor, pillBg,
}: {
  icon: React.ElementType; label: string; items: string[];
  iconColor: string; dotColor: string; pillBg: string;
}) {
  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Section label */}
      <div className="flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${pillBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <span className={`text-[11px] font-bold uppercase tracking-widest ${iconColor}`}>{label}</span>
      </div>
      {/* Items */}
      <ul className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <ChevronRight className={`h-4 w-4 mt-0.5 shrink-0 ${dotColor}`} />
            <p className="text-[13.5px] text-slate-700 dark:text-slate-200 leading-snug">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
interface Props {
  insights: AIInsights | null;
  isLoading: boolean;
  error?: string | null;
}

export function AIInsightsCard({ insights, isLoading, error }: Props) {
  if (isLoading) return <AILoadingSkeleton />;

  if (error || !insights) {
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 px-5 py-4 ring-1 ring-amber-200 dark:ring-amber-800">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <p className="text-sm text-amber-700 dark:text-amber-400">AI insights unavailable — {error ?? "unknown error"}</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-md shadow-indigo-100/50 dark:shadow-indigo-900/20 ring-1 ring-indigo-200/60 dark:ring-indigo-800/40">

      {/* ── Gradient header ──────────────────────────────────────────── */}
      <div className="relative flex items-center justify-between px-6 py-5 bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600 overflow-hidden">
        {/* Dot grid decoration */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-white opacity-20 blur-sm" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/30">
              <Brain className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-[15px] font-bold text-white leading-none">AI Analysis</p>
            <p className="text-xs text-indigo-200 mt-1">Powered by Groq · LLaMA 3.3 70B</p>
          </div>
        </div>
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20">
            <Cpu className="h-3 w-3" /> AI-powered
          </span>
        </div>
      </div>

      {/* ── Summary banner ───────────────────────────────────────────── */}
      <div className="relative px-6 py-5 bg-indigo-50/60 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/50">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-indigo-500 to-violet-500 rounded-l-none" />
        <p className="text-[14px] font-medium text-slate-800 dark:text-slate-100 leading-relaxed pl-2">
          {insights.summary}
        </p>
      </div>

      {/* ── Three-column grid ────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
        <InsightSection
          icon={Sparkles}    label="Key Insights"
          items={insights.insights}
          iconColor="text-indigo-600 dark:text-indigo-400"
          dotColor="text-indigo-400 dark:text-indigo-500"
          pillBg="bg-indigo-50 dark:bg-indigo-950/60"
        />
        <InsightSection
          icon={Lightbulb}   label="Content Patterns"
          items={insights.patterns}
          iconColor="text-violet-600 dark:text-violet-400"
          dotColor="text-violet-400 dark:text-violet-500"
          pillBg="bg-violet-50 dark:bg-violet-950/60"
        />
        <InsightSection
          icon={Target}      label="Recommendations"
          items={insights.recommendations}
          iconColor="text-emerald-600 dark:text-emerald-400"
          dotColor="text-emerald-400 dark:text-emerald-500"
          pillBg="bg-emerald-50 dark:bg-emerald-950/60"
        />
      </div>
    </div>
  );
}
