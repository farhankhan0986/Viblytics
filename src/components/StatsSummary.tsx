import { ChannelStats } from "@/types";
import { Eye, Film, TrendingUp, Users } from "lucide-react";

export function StatsSummary({ channel }: { channel: ChannelStats }) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const stats = [
    { name: "Total Videos (30d)", value: channel.videoCount, icon: Film },
    { name: "Total Views (30d)", value: formatNumber(channel.totalViews), icon: Eye },
    { name: "Avg Views/Video", value: formatNumber(channel.avgViews), icon: TrendingUp },
    { name: "Subscribers", value: channel.subscriberCount ? formatNumber(channel.subscriberCount) : "N/A", icon: Users },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-shadow cursor-default">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <stat.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{stat.name}</span>
          </div>
          <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
