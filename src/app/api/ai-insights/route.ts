import { NextResponse } from 'next/server';
import type { AIInsights, AnalyzeResponse } from '@/types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL        = 'llama-3.3-70b-versatile';

function buildPrompt(data: AnalyzeResponse): string {
  const { channel, videos } = data;

  // Keep context compact — top 20 by views, key metrics only
  const compact = [...videos]
    .sort((a, b) => b.views - a.views)
    .slice(0, 20)
    .map(v => ({
      title:    v.title,
      views:    v.views,
      likes:    v.likes,
      comments: v.comments,
      er:       v.engagementRate ?? 0,
      date:     v.publishedAt.split('T')[0],
      trending: v.isTrending ?? false,
    }));

  return `You are an expert YouTube growth analyst reviewing a competitor channel.

Channel: ${channel.title}
Subscribers: ${channel.subscriberCount ?? 'hidden'}
30-day videos: ${channel.videoCount}
30-day total views: ${channel.totalViews}
30-day avg views: ${channel.avgViews}

Recent videos (sorted by views):
${JSON.stringify(compact, null, 2)}

Respond ONLY with a valid JSON object (no markdown, no extra text) in this exact structure:
{
  "summary": "1–2 sentence overall performance summary",
  "insights": ["insight 1", "insight 2", "insight 3", "insight 4", "insight 5"],
  "patterns": ["pattern 1", "pattern 2", "pattern 3"],
  "recommendations": ["rec 1", "rec 2", "rec 3"]
}

Rules:
- insights: focus on engagement trends, top-performing content, upload patterns, and outliers
- patterns: focus on content patterns (title style, video length signals, topic clusters)  
- recommendations: specific, actionable, competitor-intelligence focused
- Be concise — each string should be 1 clear sentence
- Do not use markdown inside strings`;
}

// Fallback: full data-driven insights when Groq is unavailable
function generateFallback(data: AnalyzeResponse): AIInsights {
  const { channel, videos } = data;
  if (videos.length === 0) {
    return { summary: 'No video data available.', insights: [], patterns: [], recommendations: [] };
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

  // Core stats
  const avgER      = videos.reduce((s, v) => s + (v.engagementRate ?? 0), 0) / videos.length;
  const maxViews   = Math.max(...videos.map(v => v.views));
  const minViews   = Math.min(...videos.map(v => v.views));
  const topVideo   = videos.find(v => v.views === maxViews);
  const trendCount = videos.filter(v => v.isTrending).length;

  // Best posting day
  const dayCount: Record<string, number> = {};
  videos.forEach(v => {
    const day = new Date(v.publishedAt).toLocaleDateString('en-US', { weekday: 'long' });
    dayCount[day] = (dayCount[day] ?? 0) + 1;
  });
  const bestDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'various days';

  // View distribution
  const sortedByViews = [...videos].sort((a, b) => b.views - a.views);
  const top20pctAvg   = sortedByViews.slice(0, Math.max(1, Math.floor(videos.length * 0.2)))
    .reduce((s, v) => s + v.views, 0) / Math.max(1, Math.floor(videos.length * 0.2));
  const bottom80pctAvg = sortedByViews.slice(Math.floor(videos.length * 0.2))
    .reduce((s, v) => s + v.views, 0) / Math.max(1, videos.length - Math.floor(videos.length * 0.2));
  const topMultiple = bottom80pctAvg > 0 ? (top20pctAvg / bottom80pctAvg).toFixed(1) : '—';

  // Recent vs older momentum
  const sorted = [...videos].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const half = Math.floor(sorted.length / 2) || 1;
  const recentAvg = sorted.slice(0, half).reduce((s, v) => s + v.views, 0) / half;
  const olderAvg  = sorted.slice(half).reduce((s, v) => s + v.views, 0) / (sorted.length - half || 1);
  const momentum  = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg * 100).toFixed(0) : '0';
  const momentumDir = recentAvg >= olderAvg ? 'up' : 'down';

  // Engagement tiers
  const highER  = videos.filter(v => (v.engagementRate ?? 0) >= 5).length;
  const lowER   = videos.filter(v => (v.engagementRate ?? 0) < 2).length;

  // Cadence
  const cadence = (videos.length / 13).toFixed(1);

  const summary =
    `${channel.title} is a ${channel.subscriberCount ? fmt(channel.subscriberCount) + '-subscriber' : 'high-reach'} channel with ${fmt(channel.avgViews)} avg views per video and a ${avgER.toFixed(1)}% channel-wide engagement rate — ${avgER >= 5 ? 'exceptional' : avgER >= 2 ? 'solid' : 'below-average'} audience interaction.`;

  const insights = [
    `Top video "${topVideo?.title.slice(0, 50)}…" reached ${fmt(maxViews)} views — ${(maxViews / (channel.avgViews || 1)).toFixed(1)}× the channel average.`,
    `${trendCount} of ${videos.length} analyzed videos (${Math.round(trendCount / videos.length * 100)}%) are trending above the 80th-percentile view threshold.`,
    `Recent uploads are performing ${momentumDir} ${Math.abs(+momentum)}% versus older content (${fmt(Math.round(recentAvg))} vs ${fmt(Math.round(olderAvg))} avg views).`,
    `Engagement rate averages ${avgER.toFixed(2)}%: ${highER} videos exceed 5% (high-engagement) and ${lowER} fall below 2% (low-engagement).`,
    `View spread is ${(maxViews / Math.max(1, minViews)).toFixed(0)}×  between best and worst-performing videos, indicating ${(maxViews / Math.max(1, minViews)) > 10 ? 'high content variability' : 'consistent output quality'}.`,
  ].filter(Boolean);

  const patterns = [
    `Top 20% of videos generate ${topMultiple}× more views than the remaining 80%, suggesting a classic power-law content distribution.`,
    `Most videos are published on ${bestDay} — timing uploads around this day may align with peak audience availability.`,
    `${highER >= videos.length * 0.4 ? 'Majority of' : 'Select'} videos achieve above-5% engagement, pointing to ${highER >= videos.length * 0.4 ? 'a highly loyal, interactive audience' : 'niche breakout moments rather than broad consistent engagement'}.`,
    `Channel publishes ~${cadence} videos/week — ${+cadence >= 2 ? 'high-frequency strategy favors algorithm discovery' : 'lower cadence signals a quality-over-quantity approach'}.`,
  ];

  const recommendations = [
    `Study the top ${Math.min(3, trendCount)} trending videos closely — replicate their topic angle or format in upcoming uploads.`,
    `${momentumDir === 'down' ? 'Recent momentum is declining — consider reviewing title/thumbnail strategy on the last 5 uploads.' : 'Momentum is positive — maintain current content pacing and double down on recent topics.'}`,
    `Target ${bestDay} as primary publish window to capitalise on observed audience activity patterns.`,
    `${lowER > 0 ? `${lowER} low-engagement videos (<2% ER) may be dragging channel metrics — audit those topics and avoid repeating them.` : 'High engagement rate across the board — lean into community features (polls, comments pinning) to sustain this.'}`,
  ];

  return { summary, insights, patterns, recommendations };
}


export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  try {
    const data: AnalyzeResponse = await request.json();

    if (!apiKey) {
      return NextResponse.json(generateFallback(data));
    }

    const prompt = buildPrompt(data);

    const groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model:       MODEL,
        messages:    [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens:  1024,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error('Groq error:', err);
      return NextResponse.json(generateFallback(data));
    }

    const groqData = await groqRes.json();
    const raw      = groqData.choices?.[0]?.message?.content ?? '';

    // Parse JSON, strip potential markdown fences
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    const parsed: AIInsights = JSON.parse(cleaned);

    // Validate shape
    if (!parsed.summary || !Array.isArray(parsed.insights)) {
      throw new Error('Invalid AI response shape');
    }

    return NextResponse.json(parsed);

  } catch (err) {
    console.error('AI insights error:', err);
    try {
      // Try to return fallback with whatever data we have
      const data: AnalyzeResponse = await request.clone().json().catch(() => null);
      if (data) return NextResponse.json(generateFallback(data));
    } catch {}
    return NextResponse.json({ error: 'AI insights unavailable' }, { status: 500 });
  }
}
