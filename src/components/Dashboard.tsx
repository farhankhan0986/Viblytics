"use client";

import { AnalyzeResponse } from "@/types";
import { ChannelSummaryCard } from "@/components/ChannelSummaryCard";
import { PerformanceChart } from "@/components/PerformanceChart";
import { VideoTable } from "@/components/VideoTable";

interface Props {
  data: AnalyzeResponse;
}

export function Dashboard({ data }: Props) {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in-up">
      {/* 1. Channel identity + stats */}
      <ChannelSummaryCard channel={data.channel} />

      {/* 2. Top 5 chart — prominent, full-width, below summary */}
      <PerformanceChart videos={data.videos} />

      {/* 3. Sortable / filterable video table */}
      <VideoTable videos={data.videos} channelTitle={data.channel.title} />
    </div>
  );
}
