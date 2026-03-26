import { ChannelStats } from "@/types";
import { Users, Eye, Film, TrendingUp } from "lucide-react";

function fmt(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return new Intl.NumberFormat("en-US").format(num);
}

interface Props { channel: ChannelStats; }

export function ChannelSummaryCard({ channel }: Props) {
  const stats = [
    { label: "Subscribers", value: channel.subscriberCount ? fmt(channel.subscriberCount) : "—", icon: Users, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/70", border: "border-indigo-100 dark:border-indigo-900/60" },
    { label: "Videos (30d)", value: channel.videoCount.toString(), icon: Film, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/70", border: "border-violet-100 dark:border-violet-900/60" },
    { label: "Total Views (30d)", value: fmt(channel.totalViews), icon: Eye, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-950/70", border: "border-sky-100 dark:border-sky-900/60" },
    { label: "Avg Views/Video", value: fmt(channel.avgViews), icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/70", border: "border-emerald-100 dark:border-emerald-900/60" },
  ];

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
      {/* Gradient banner */}
      <div className="relative bg-linear-to-br from-indigo-600 via-indigo-500 to-violet-600 px-8 pt-8 pb-16">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }}
        />
        {/* Top-right glow orb */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-violet-400 opacity-20 blur-3xl" />

        <div className="relative flex items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-2xl ring-4 ring-white/20 blur-sm scale-105" />
            <img
              src={channel.thumbnail}
              alt={channel.title}
              className="relative w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-xl"
            />
            <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-white/80 shadow">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
            </span>
          </div>
          {/* Channel info */}
          <div>
            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">YouTube Channel</p>
            <h2 className="text-2xl font-extrabold text-white leading-tight tracking-tight">{channel.title}</h2>
            {channel.subscriberCount && (
              <p className="text-indigo-200/80 text-sm mt-1 font-medium">
                {new Intl.NumberFormat("en-US").format(channel.subscriberCount)} subscribers
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Floating stat tiles */}
      <div className="relative -mt-8 mx-5 mb-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`animate-fade-in-up flex flex-col gap-3.5 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-lg ring-1 ${s.border} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-default`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.bg}`}>
              <s.icon className={`h-[18px] w-[18px] ${s.color}`} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mb-2">{s.label}</p>
              <p className="text-[22px] font-bold tracking-tight text-slate-900 dark:text-white leading-none tabular-nums">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
