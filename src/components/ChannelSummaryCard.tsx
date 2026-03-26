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
    { label: "Subscribers",      value: channel.subscriberCount ? fmt(channel.subscriberCount) : "—", icon: Users,      color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/60" },
    { label: "Videos (30d)",     value: channel.videoCount.toString(),                                 icon: Film,       color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/60" },
    { label: "Total Views (30d)",value: fmt(channel.totalViews),                                       icon: Eye,        color: "text-sky-600 dark:text-sky-400",     bg: "bg-sky-50 dark:bg-sky-950/60"      },
    { label: "Avg Views/Video",  value: fmt(channel.avgViews),                                         icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/60" },
  ];

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
      {/* Gradient banner */}
      <div className="relative bg-linear-to-br from-indigo-600 via-indigo-500 to-violet-600 px-8 pt-8 pb-16">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="relative flex items-center gap-5">
          <div className="relative">
            <img src={channel.thumbnail} alt={channel.title} className="w-20 h-20 rounded-2xl border-4 border-white/30 shadow-lg object-cover" />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <div>
            <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest mb-1">YouTube Channel</p>
            <h2 className="text-2xl font-extrabold text-white leading-tight">{channel.title}</h2>
            {channel.subscriberCount && (
              <p className="text-indigo-200 text-sm mt-0.5">
                {new Intl.NumberFormat("en-US").format(channel.subscriberCount)} subscribers
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Floating stat tiles */}
      <div className="relative -mt-8 mx-6 mb-0 grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={s.label}
            className="animate-fade-in-up flex flex-col gap-3 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-md ring-1 ring-slate-100 dark:ring-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-default"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 leading-none mb-1.5">{s.label}</p>
              <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-none tabular-nums">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-slate-900 h-6 rounded-b-2xl" />
    </div>
  );
}
