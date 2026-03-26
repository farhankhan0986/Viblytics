"use client";

import { useState, useEffect, useRef } from "react";
import { AnalyzeResponse, AIInsights } from "@/types";
import { ChannelSummaryCard } from "@/components/ChannelSummaryCard";
import { AIInsightsCard }     from "@/components/AIInsightsCard";
import { ChannelInsights }    from "@/components/ChannelInsights";
import { PerformanceChart }   from "@/components/PerformanceChart";
import { VideoTable }         from "@/components/VideoTable";

interface Props {
  data: AnalyzeResponse;
}

export function Dashboard({ data }: Props) {
  const [aiInsights, setAiInsights]   = useState<AIInsights | null>(null);
  const [aiLoading,  setAiLoading]    = useState(true);
  const [aiError,    setAiError]      = useState<string | null>(null);

  // Only fetch once per data object — keyed by channel id
  const fetchedFor = useRef<string | null>(null);

  useEffect(() => {
    if (fetchedFor.current === data.channel.id) return;
    fetchedFor.current = data.channel.id;

    setAiInsights(null);
    setAiLoading(true);
    setAiError(null);

    fetch("/api/ai-insights", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    })
      .then(res => {
        if (!res.ok) throw new Error("AI insights request failed");
        return res.json();
      })
      .then((json: AIInsights) => {
        setAiInsights(json);
        setAiLoading(false);
      })
      .catch(err => {
        setAiError(err.message ?? "AI insights unavailable");
        setAiLoading(false);
      });
  }, [data]);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in-up">
      {/* 1. Channel identity + 30-day stats */}
      <ChannelSummaryCard channel={data.channel} />

      {/* 2. AI-powered analysis (async, loads after YouTube data) */}
      <AIInsightsCard
        insights={aiInsights}
        isLoading={aiLoading}
        error={aiError}
      />

      {/* 3. Rules-based instant insights */}
      <ChannelInsights channel={data.channel} videos={data.videos} />

      {/* 4. Charts */}
      <PerformanceChart videos={data.videos} />

      {/* 5. Sortable / filterable video table */}
      <VideoTable videos={data.videos} channelTitle={data.channel.title} />
    </div>
  );
}
