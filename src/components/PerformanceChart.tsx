"use client";

import { VideoStats } from "@/types";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, LabelList,
  ScatterChart, Scatter, ZAxis, Legend,
} from "recharts";
import { useTheme } from "@/components/ThemeProvider";
import { useState } from "react";
import { BarChart2, Crosshair } from "lucide-react";

const BAR_COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

// ── Custom tooltips ───────────────────────────────────────────────────────
const BarTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 shadow-xl text-sm min-w-[180px]">
      <p className="text-xs font-medium text-slate-400 mb-1 leading-snug line-clamp-2">{payload[0].payload.fullTitle}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{fmt(payload[0].value)}</p>
      <p className="text-xs text-slate-400 mt-0.5">views</p>
    </div>
  );
};

const ScatterTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 shadow-xl text-sm min-w-[200px]">
      <p className="text-xs font-medium text-slate-400 mb-1.5 leading-snug line-clamp-2">{d.fullTitle}</p>
      <div className="flex gap-4">
        <div><p className="text-xs text-slate-400">Views</p><p className="font-bold text-slate-900 dark:text-white tabular-nums">{fmt(d.views)}</p></div>
        <div><p className="text-xs text-slate-400">Eng. Rate</p><p className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{d.er.toFixed(2)}%</p></div>
      </div>
      {d.isTrending && <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 text-xs font-medium text-rose-600 dark:text-rose-400">🔥 Trending</span>}
    </div>
  );
};

const CustomYTick = ({ x, y, payload, isDark }: any) => (
  <text x={x - 8} y={y} dy={4} textAnchor="end" fill={isDark ? "#94a3b8" : "#64748b"} fontSize={12} fontFamily="inherit">
    {payload.value}
  </text>
);

// ── Component ─────────────────────────────────────────────────────────────
export function PerformanceChart({ videos }: { videos: VideoStats[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<"bar" | "scatter">("bar");

  if (videos.length === 0) return null;

  const top5 = [...videos]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((v, i) => ({
      rank: i + 1,
      name: v.title.length > 32 ? v.title.substring(0, 32) + "…" : v.title,
      fullTitle: v.title,
      views: v.views,
      colorIndex: i,
    }))
    .reverse();

  const scatterData = videos.map(v => ({
    views: v.views,
    er: v.engagementRate ?? (v.views > 0 ? +((v.likes + v.comments) / v.views * 100).toFixed(2) : 0),
    fullTitle: v.title,
    isTrending: v.isTrending,
  }));

  const trending = scatterData.filter(d => d.isTrending);
  const nonTrending = scatterData.filter(d => !d.isTrending);

  const maxViews = Math.max(...top5.map(d => d.views));
  const gridColor = isDark ? "#1e293b" : "#f1f5f9";
  const tickColor = isDark ? "#94a3b8" : "#94a3b8";

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {activeTab === "bar" ? "Top 5 Videos by Views" : "Views vs Engagement Rate"}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeTab === "bar" ? "Last 30 days · Sorted by total view count" : "Each dot = one video · Trending highlighted"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "bar" && (
            <div className="hidden sm:flex items-center gap-2 mr-3">
              <span className="text-xs text-slate-400 font-medium">Peak:</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{fmt(maxViews)}</span>
            </div>
          )}
          {/* Tab toggle */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            {([
              { key: "bar", icon: BarChart2, label: "Top 5" },
              { key: "scatter", icon: Crosshair, label: "Scatter" },
            ] as const).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 focus:outline-none
                  ${activeTab === key
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="px-2 pt-4 pb-6 h-[280px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          {activeTab === "bar" ? (
            <BarChart layout="vertical" data={top5} margin={{ top: 0, right: 64, left: 160, bottom: 0 }} barCategoryGap="28%">
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke={gridColor} />
              <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} tickCount={5} />
              <YAxis type="category" dataKey="name" tick={<CustomYTick isDark={isDark} />} axisLine={false} tickLine={false} width={152} />
              <Tooltip content={<BarTooltip />} cursor={{ fill: isDark ? "#1e293b" : "#f8fafc", radius: 6 }} />
              <Bar dataKey="views" radius={[0, 6, 6, 0]} maxBarSize={36}>
                {top5.map((entry) => <Cell key={entry.rank} fill={BAR_COLORS[entry.colorIndex]} />)}
                <LabelList dataKey="views" position="right" formatter={fmt as any} style={{ fontSize: 11, fontWeight: 600, fill: tickColor }} />
              </Bar>
            </BarChart>
          ) : (
            <ScatterChart margin={{ top: 8, right: 24, left: 8, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                type="number" dataKey="views" name="Views"
                tickFormatter={fmt} tick={{ fontSize: 11, fill: tickColor }}
                axisLine={false} tickLine={false}
                label={{ value: "Views", position: "insideBottom", offset: -10, fill: tickColor, fontSize: 11 }}
              />
              <YAxis
                type="number" dataKey="er" name="Eng. Rate"
                tickFormatter={v => v + "%"} tick={{ fontSize: 11, fill: tickColor }}
                axisLine={false} tickLine={false}
                label={{ value: "Engagement %", angle: -90, position: "insideLeft", fill: tickColor, fontSize: 11, offset: 12 }}
              />
              <ZAxis range={[40, 40]} />
              <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: "3 3" }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Scatter name="Regular" data={nonTrending} fill="#818cf8" fillOpacity={0.75} />
              <Scatter name="Trending" data={trending} fill="#ef4444" fillOpacity={0.85} />
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend — only for bar chart */}
      {activeTab === "bar" && (
        <div className="flex items-center gap-4 px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex-wrap">
          {[...top5].reverse().map((d) => (
            <div key={d.rank} className="flex items-center gap-1.5 min-w-0">
              <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: BAR_COLORS[d.colorIndex] }} />
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]" title={d.fullTitle}>#{d.rank} {d.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
