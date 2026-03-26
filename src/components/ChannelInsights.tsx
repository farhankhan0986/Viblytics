"use client";

import { VideoStats, ChannelStats } from "@/types";
import { TrendingUp, Calendar, Zap, Target, Lightbulb } from "lucide-react";

// ── Insight engine ──────────────────────────────────────────────────────────

function getDayName(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

function generateInsights(channel: ChannelStats, videos: VideoStats[]): Insight[] {
  const insights: Insight[] = [];
  if (videos.length < 2) return insights;

  const engRates = videos.map(v => v.engagementRate ?? 0);
  const avgER    = engRates.reduce((a, b) => a + b, 0) / engRates.length;
  const maxER    = Math.max(...engRates);
  const topVid   = videos.find(v => (v.engagementRate ?? 0) === maxER);

  // 1. Engagement leader vs average
  if (topVid && avgER > 0) {
    const mult  = (maxER / avgER).toFixed(1);
    const level = maxER > 5 ? "exceptional" : maxER > 2 ? "solid" : "moderate";
    insights.push({
      icon:  Zap,
      accent: "indigo",
      title: "Engagement Leader",
      body:  `"${topVid.title.slice(0, 42)}…" drives ${mult}× the channel avg engagement at ${maxER.toFixed(1)}% — ${level} performance.`,
      stat:  `${maxER.toFixed(1)}% ER`,
    });
  }

  // 2. Posting cadence + most active day
  const dayCount: Record<string, number> = {};
  videos.forEach(v => {
    const day = getDayName(new Date(v.publishedAt));
    dayCount[day] = (dayCount[day] ?? 0) + 1;
  });
  const bestDay  = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0];
  const cadence  = (videos.length / 13).toFixed(1); // 90d ≈ 13 weeks
  insights.push({
    icon:  Calendar,
    accent: "violet",
    title: "Posting Cadence",
    body:  `Most active on ${bestDay?.[0] ?? "various days"} — ${videos.length} video${videos.length !== 1 ? "s" : ""} in the window, roughly ${cadence}/week.`,
    stat:  `${cadence}/wk`,
  });

  // 3. Recent view velocity vs older videos
  const sorted = [...videos].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const half      = Math.floor(sorted.length / 2);
  const recentAvg = sorted.slice(0, half).reduce((s, v) => s + v.views, 0) / half;
  const olderAvg  = sorted.slice(half).reduce((s, v) => s + v.views, 0) / (sorted.length - half);
  if (olderAvg > 0) {
    const delta = ((recentAvg - olderAvg) / olderAvg * 100).toFixed(0);
    const up    = recentAvg >= olderAvg;
    insights.push({
      icon:  TrendingUp,
      accent: up ? "emerald" : "rose",
      title: "View Momentum",
      body:  `Recent videos are ${up ? "outperforming" : "underperforming"} older ones by ${Math.abs(+delta)}% in avg views (${fmtNum(Math.round(recentAvg))} vs ${fmtNum(Math.round(olderAvg))}).`,
      stat:  `${up ? "+" : ""}${delta}%`,
    });
  }

  // 4. Trending coverage
  const trendCount = videos.filter(v => v.isTrending).length;
  if (trendCount > 0) {
    const pct = Math.round((trendCount / videos.length) * 100);
    insights.push({
      icon:  Target,
      accent: "rose",
      title: "Trending Coverage",
      body:  `${trendCount} of ${videos.length} videos (${pct}%) exceed the 80th-percentile view threshold — ${trendCount >= 4 ? "strong viral momentum" : trendCount >= 2 ? "above-average hit rate" : "selective breakout"}.`,
      stat:  `${pct}% viral`,
    });
  }

  return insights;
}

function fmtNum(n: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

// ── Types ──────────────────────────────────────────────────────────────────
type Accent = "indigo" | "violet" | "emerald" | "rose";

interface Insight {
  icon:   React.ElementType;
  accent: Accent;
  title:  string;
  body:   string;
  stat:   string;
}

// Per-accent design tokens
const ACCENT: Record<Accent, { border: string; iconBg: string; iconColor: string; statBg: string; statText: string; num: string }> = {
  indigo:  { border: "border-indigo-500",  iconBg: "bg-indigo-50 dark:bg-indigo-950/70",   iconColor: "text-indigo-600 dark:text-indigo-400",  statBg: "bg-indigo-50 dark:bg-indigo-950/60",  statText: "text-indigo-700 dark:text-indigo-300",  num: "text-indigo-600 dark:text-indigo-400"  },
  violet:  { border: "border-violet-500",  iconBg: "bg-violet-50 dark:bg-violet-950/70",   iconColor: "text-violet-600 dark:text-violet-400",  statBg: "bg-violet-50 dark:bg-violet-950/60",  statText: "text-violet-700 dark:text-violet-300",  num: "text-violet-600 dark:text-violet-400"  },
  emerald: { border: "border-emerald-500", iconBg: "bg-emerald-50 dark:bg-emerald-950/70", iconColor: "text-emerald-600 dark:text-emerald-400", statBg: "bg-emerald-50 dark:bg-emerald-950/60", statText: "text-emerald-700 dark:text-emerald-300", num: "text-emerald-600 dark:text-emerald-400" },
  rose:    { border: "border-rose-500",    iconBg: "bg-rose-50 dark:bg-rose-950/70",       iconColor: "text-rose-600 dark:text-rose-400",      statBg: "bg-rose-50 dark:bg-rose-950/60",      statText: "text-rose-700 dark:text-rose-300",      num: "text-rose-600 dark:text-rose-400"      },
};

// ── Component ──────────────────────────────────────────────────────────────
export function ChannelInsights({
  channel,
  videos,
}: {
  channel: ChannelStats;
  videos: VideoStats[];
}) {
  const insights = generateInsights(channel, videos);
  if (insights.length === 0) return null;

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-violet-600 shadow-sm">
            <Lightbulb className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-none">Channel Insights</h3>
            <p className="text-xs text-slate-400 mt-0.5">Auto-generated from performance patterns</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-100 dark:ring-indigo-900">
          {insights.length} insight{insights.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Insight cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        {insights.map((ins, i) => {
          const a = ACCENT[ins.accent];
          return (
            <div
              key={i}
              className={`relative flex flex-col gap-3 rounded-xl border-l-4 ${a.border} bg-slate-50/80 dark:bg-slate-800/40 px-5 py-4 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition-colors duration-150`}
            >
              {/* Number badge */}
              <span className={`absolute top-3.5 right-4 text-[10px] font-bold tabular-nums ${a.num} opacity-40`}>
                0{i + 1}
              </span>

              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${a.iconBg}`}>
                  <ins.icon className={`h-4 w-4 ${a.iconColor}`} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{ins.title}</p>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{ins.body}</p>

              {/* Stat pill */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full ${a.statBg} px-2.5 py-1 text-xs font-semibold ${a.statText} ring-1 ring-inset ring-current/10`}>
                  {ins.stat}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
