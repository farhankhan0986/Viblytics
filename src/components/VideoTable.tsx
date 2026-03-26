"use client";

import { useState, useMemo } from "react";
import { VideoStats } from "@/types";
import { formatDistanceToNow, subDays, isAfter } from "date-fns";
import {
  Flame, ArrowUp, ArrowDown, ArrowUpDown,
  FileSpreadsheet, RotateCcw, Filter, HelpCircle,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
type SortField = "views" | "likes" | "comments" | "publishedAt";
type DateRange = 7 | 14 | 30 | 90 | 0; // 0 = All time

const DATE_RANGE_OPTIONS: { label: string; value: DateRange }[] = [
  { label: "7 days",  value: 7  },
  { label: "14 days", value: 14 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "All time", value: 0 },
];

const SORT_OPTIONS: { label: string; field: SortField }[] = [
  { label: "Views",    field: "views"       },
  { label: "Likes",    field: "likes"       },
  { label: "Comments", field: "comments"    },
  { label: "Date",     field: "publishedAt" },
];

// ── Metric descriptions for tooltips ─────────────────────────────────────────
const METRIC_INFO: Record<string, string> = {
  views:    "Total view count accumulated on YouTube since the video was published.",
  likes:    "Total likes the video has received (some channels hide exact counts).",
  comments: "Total public comments on the video at time of last fetch.",
};

// ── Tooltip sub-component (CSS-only, no library) ──────────────────────────────
function HelpTooltip({ text }: { text: string }) {
  return (
    <span className="relative inline-flex group/tip ml-1 align-middle cursor-default">
      <HelpCircle className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 group-hover/tip:text-indigo-500 transition-colors" />
      <span
        role="tooltip"
        className={`
          pointer-events-none absolute top-full left-1/2 z-100 mt-2 w-52 -translate-x-1/2
          rounded-xl bg-slate-900 dark:bg-slate-700 px-3 py-2.5
          text-xs font-normal text-white leading-relaxed text-center shadow-2xl
          opacity-0 scale-95 transition-all duration-150 origin-top
          group-hover/tip:opacity-100 group-hover/tip:scale-100
        `}
      >
        {/* arrow pointing up */}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900 dark:border-b-slate-700" />
        {text}
      </span>
    </span>
  );
}

// ── Helper ───────────────────────────────────────────────────────────────────
function fmtNum(n: number) {
  return new Intl.NumberFormat().format(n);
}

// ── Component ────────────────────────────────────────────────────────────────
export function VideoTable({
  videos,
  channelTitle,
}: {
  videos: VideoStats[];
  channelTitle: string;
}) {
  const [sortField, setSortField] = useState<SortField>("views");
  const [sortDesc, setSortDesc]   = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>(30);
  const [minViews, setMinViews]   = useState("");

  // ── Derived data ────────────────────────────────────────────────────────
  const processedVideos = useMemo(() => {
    const cutoff = dateRange > 0 ? subDays(new Date(), dateRange) : null;
    const minV   = minViews ? parseInt(minViews.replace(/,/g, ""), 10) : 0;

    return [...videos]
      .filter(v => {
        if (cutoff && !isAfter(new Date(v.publishedAt), cutoff)) return false;
        if (minV > 0 && v.views < minV) return false;
        return true;
      })
      .sort((a, b) => {
        const valA = sortField === "publishedAt"
          ? new Date(a.publishedAt).getTime()
          : (a[sortField] as number);
        const valB = sortField === "publishedAt"
          ? new Date(b.publishedAt).getTime()
          : (b[sortField] as number);
        return sortDesc ? valB - valA : valA - valB;
      });
  }, [videos, sortField, sortDesc, dateRange, minViews]);

  const hasFilters = dateRange !== 30 || minViews !== "";
  const hasData    = processedVideos.length > 0;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDesc(d => !d);
    else { setSortField(field); setSortDesc(true); }
  };

  const resetFilters = () => {
    setDateRange(30);
    setMinViews("");
  };

  const handleExport = () => {
    if (!hasData) return;
    const headers = ["Title", "Published At", "URL", "Views", "Likes", "Comments", "Engagement %", "Trending"];
    const rows = processedVideos.map(v => {
      const eng = v.views > 0 ? (((v.likes + v.comments) / v.views) * 100).toFixed(2) + "%" : "0%";
      return [
        `"${v.title.replace(/"/g, '""')}"`,
        new Date(v.publishedAt).toLocaleDateString(),
        v.url, v.views, v.likes, v.comments, eng,
        v.isTrending ? "Yes" : "No",
      ].join(",");
    });
    const csv  = [headers.join(","), ...rows].join("\n");
    const link = document.createElement("a");
    link.href  = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    link.setAttribute("download", `${channelTitle}_${sortField}_${dateRange || "all"}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Sub-components ────────────────────────────────────────────────────────
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />;
    return sortDesc
      ? <ArrowDown className="h-3.5 w-3.5 text-indigo-500" />
      : <ArrowUp   className="h-3.5 w-3.5 text-indigo-500" />;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 space-y-3">

        {/* Row 1 — Title + Export */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Videos</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {hasData
                ? `${processedVideos.length} video${processedVideos.length !== 1 ? "s" : ""} · sorted by ${sortField} (${sortDesc ? "↓ high" : "↑ low"})`
                : "No videos match the active filters"}
            </p>
          </div>

          <button
            onClick={handleExport}
            disabled={!hasData}
            title={hasData ? `Export ${processedVideos.length} videos` : "No data"}
            className={`
              group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
              ${hasData
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-500 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"}
            `}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
            {hasData && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-white/20 px-1.5 text-xs font-bold tabular-nums">
                {processedVideos.length}
              </span>
            )}
          </button>
        </div>

        {/* Row 2 — Sort pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-400 shrink-0">Sort by</span>
          {SORT_OPTIONS.map(({ label, field }) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                ${sortField === field
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }
              `}
            >
              {label}
              {sortField === field && (
                sortDesc
                  ? <ArrowDown className="h-3 w-3" />
                  : <ArrowUp   className="h-3 w-3" />
              )}
            </button>
          ))}
        </div>

        {/* Row 3 — Filter controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium text-slate-400 shrink-0 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Filter
          </span>

          {/* Date range */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            {DATE_RANGE_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setDateRange(value)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-all duration-150 focus:outline-none whitespace-nowrap
                  ${dateRange === value
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Min views input */}
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3 text-xs text-slate-400 font-medium">≥</span>
            <input
              type="number"
              min="0"
              value={minViews}
              onChange={e => setMinViews(e.target.value)}
              placeholder="Min views"
              className="w-28 rounded-xl border border-slate-200 bg-white py-1.5 pl-6 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              aria-label="Minimum view count filter"
            />
          </div>

          {/* Reset */}
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto overflow-y-visible">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
          <thead className="bg-slate-50/70 dark:bg-slate-800/50 overflow-visible">
            <tr>
              <th scope="col" className="py-3 pl-5 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Video
              </th>
              {(["views", "likes", "comments"] as SortField[]).map(field => (
                <th
                  key={field}
                  scope="col"
                  onClick={() => handleSort(field)}
                  className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide cursor-pointer select-none transition-colors
                    ${sortField === field ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"}
                  `}
                >
                  <div className="flex items-center gap-1 w-max">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    <SortIcon field={field} />
                    {METRIC_INFO[field] && <HelpTooltip text={METRIC_INFO[field]} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {processedVideos.map((video) => (
              <tr
                key={video.id}
                className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors duration-100"
              >
                {/* Video cell */}
                <td className="py-3.5 pl-5 pr-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 shadow-sm ring-1 ring-slate-200/60 dark:ring-slate-700/60">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0">
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors max-w-[220px] sm:max-w-[340px]"
                        title={video.title}
                      >
                        {video.title}
                      </a>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-slate-400">
                          {formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}
                        </span>
                        {video.isTrending && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-400 ring-1 ring-inset ring-rose-600/20 dark:ring-rose-800">
                            <Flame className="h-3 w-3" /> Trending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Metric cells */}
                <td className="whitespace-nowrap px-3 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                  {fmtNum(video.views)}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                  {fmtNum(video.likes)}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                  {fmtNum(video.comments)}
                </td>
              </tr>
            ))}

            {/* Empty state */}
            {!hasData && (
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                      <Filter className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No videos match your filters</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Try adjusting the date range or minimum views</p>
                    <button
                      onClick={resetFilters}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" /> Reset filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
