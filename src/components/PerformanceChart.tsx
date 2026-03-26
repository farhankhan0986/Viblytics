"use client";

import { VideoStats } from "@/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList } from "recharts";
import { useTheme } from "@/components/ThemeProvider";

const BAR_COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 shadow-xl text-sm min-w-[180px]">
      <p className="text-xs font-medium text-slate-400 dark:text-slate-400 mb-1 leading-snug line-clamp-2">{payload[0].payload.fullTitle}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{fmt(payload[0].value)}</p>
      <p className="text-xs text-slate-400 mt-0.5">views</p>
    </div>
  );
};

const CustomYTick = ({ x, y, payload, isDark }: any) => (
  <text x={x - 8} y={y} dy={4} textAnchor="end" fill={isDark ? "#94a3b8" : "#64748b"} fontSize={12} fontFamily="inherit">
    {payload.value}
  </text>
);

export function PerformanceChart({ videos }: { videos: VideoStats[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

  const maxViews = Math.max(...top5.map(d => d.views));
  const gridColor = isDark ? "#1e293b" : "#f1f5f9";
  const tickColor = isDark ? "#94a3b8" : "#94a3b8";

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
      <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Top 5 Videos by Views</h3>
          <p className="text-xs text-slate-400 mt-0.5">Last 30 days · Sorted by total view count</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Peak:</span>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{fmt(maxViews)}</span>
        </div>
      </div>

      <div className="px-2 pt-4 pb-6 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={top5} margin={{ top: 0, right: 64, left: 160, bottom: 0 }} barCategoryGap="28%">
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke={gridColor} />
            <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} tickCount={5} />
            <YAxis type="category" dataKey="name" tick={<CustomYTick isDark={isDark} />} axisLine={false} tickLine={false} width={152} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? "#1e293b" : "#f8fafc", radius: 6 }} />
            <Bar dataKey="views" radius={[0, 6, 6, 0]} maxBarSize={36}>
              {top5.map((entry) => <Cell key={entry.rank} fill={BAR_COLORS[entry.colorIndex]} />)}
              <LabelList dataKey="views" position="right" formatter={fmt as any} style={{ fontSize: 11, fontWeight: 600, fill: tickColor }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex-wrap">
        {[...top5].reverse().map((d) => (
          <div key={d.rank} className="flex items-center gap-1.5 min-w-0">
            <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: BAR_COLORS[d.colorIndex] }} />
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]" title={d.fullTitle}>#{d.rank} {d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
