<div align="center">

# Viblytics — YouTube Competitor Analyzer

**Instantly surface a YouTube channel's best-performing content, engagement insights, and content trends.**  
Built for marketing and analytics teams who move fast and make data-driven decisions.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3-ff6b6b)](https://recharts.org/)

</div>

---

## 📸 Demo

> **Live walkthrough:** https://www.loom.com/share/accf590f488e4179a94e4b937bed7150
>
> **Shareable channel link:** https://viblytics.vercel.app/?channel=https%3A%2F%2Fyoutube.com%2F%40MrBeast

---

## ✨ Features

- AI-powered insights (Groq + LLaMA 3.3 70B)
- Engagement rate analysis
- Views vs Engagement scatter chart
- Shareable analysis URLs
- Example channels for quick demo

---

## What It Does

Paste any YouTube channel URL (or click a quick-start button). In seconds you get:

| Feature | Detail |
|---|---|
| **Channel Summary Card** | Avatar, subscriber count, 30-day totals for views and videos |
| **Channel Insights** | 4 auto-generated written observations: engagement leader, posting cadence, view momentum, trending coverage |
| **Top 5 Chart** | Horizontal bar chart of most-viewed videos, themed to match the app |
| **Views vs Engagement Scatter** | Toggle to scatter plot — every video as a dot, trending ones highlighted in red |
| **AI-powered Analysis Card** | Groq/LLaMA 3.3 generates key insights, content patterns, and recommendations in three columns |
| **Sortable Video Table** | Sort by Views, Likes, Comments, Engagement Rate, or Date |
| **Smart Filtering** | Date range (7 / 14 / 30 / 90 days / All time) + minimum view count |
| **🔥 Trending Badge** | Videos above the 80th percentile in views for the period |
| **Engagement Rate Column** | Color-coded: 🟢 >5% · 🟡 2–5% · 🔴 <2% — fully sortable |
| **CSV Export** | Exports the currently sorted + filtered list with engagement rate |
| **Shareable URLs** | `?channel=` param auto-analyzes on load — paste a link and share |
| **Quick-start Buttons** | Try @mkbhd, @MrBeast, @veritasium, @fireship, @LinusTech instantly |
| **Recent Channel Memory** | Last-searched channel shows as a clickable chip on reload |
| **Dark / Light Mode** | Toggle in header, preference saved to `localStorage` |
| **Loading Skeletons** | Pixel-matched shimmer layout while data fetches |
| **Mock Data Fallback** | Fully functional demo mode if no API key is configured |
| **Graceful Error & Empty States** | Clear prompts and banners; ensures the dashboard is never blank or broken |
| **Microinteractions** | Smooth thumbnail scaling, animated trending badges, and polished sort/filter transitions |

---

## ⚙️ Setup

### Prerequisites

- Node.js 18+
- A YouTube Data API v3 key ([get one here](https://console.cloud.google.com/apis/library/youtube.googleapis.com))

### Install

```bash
git clone https://github.com/your-org/viblytics
cd viblytics
npm install
```

### Configure

Create a `.env.local` file in the project root:

```env
YOUTUBE_API_KEY=your_api_key_here
```

> **No API key?** The app automatically falls back to a rich mock dataset with realistic channel data — 20 videos spread over 90 days, fully usable for demos.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for production

```bash
npm run build && npm start
```

---

## 🏗️ How This Was Built

### Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server components, API routes, `useSearchParams` for URL state |
| Language | TypeScript 5 | End-to-end type safety from API response → component props |
| Styling | Tailwind CSS v4 | Class-based dark mode via `@custom-variant dark` |
| Charts | Recharts 3 | Bar chart + ScatterChart — both composable, React-native |
| Date logic | date-fns | Tree-shakeable date filtering for time range controls |
| Icons | lucide-react | Consistent, accessible icon set |

### Architecture Decisions

**1. API Route as BFF (Backend-for-Frontend)**  
`/api/analyze` orchestrates: handle → channel ID → uploads playlist → video stats. The API key never leaves the server.

**2. Mock-first resilience**  
Mock fallback generates structurally identical data (20 videos over 90 days) so the app is always demo-ready.

**3. 80th-percentile trending**  
Computed server-side: `views ≥ sorted_views[floor(0.8 × n)]`. Relative to the channel's own data — meaningful for any channel size.

**4. Rules-based Channel Insights**  
No external AI API. Four deterministic rules:
  - Engagement leader: top video ER vs channel average
  - Posting cadence: most active day + videos/week
  - View momentum: recent half vs older half view average
  - Trending coverage: how many videos hit the 80th percentile

**5. Client-side filtering via `useMemo`**  
Sort/filter on the video table is instant — no re-fetch, no loading state.

**6. Shareable URL state**  
`?channel=` param is read on mount via `useSearchParams`. Analyzing a channel pushes the param to history. Any link to the app auto-analyzes the embedded channel.

**7. Dark mode without flash**  
ThemeProvider applies `.dark` class on `<html>` before paint, using `suppressHydrationWarning`. System preference detected on first visit.

---

## 🗺️ Product Thinking & Roadmap

### MVP Prioritization

Every feature was weighed against: *"Does this help a marketer understand competitor content strategy faster?"*

- **Trending badge** → answers "which videos are working right now?"
- **Channel Insights card** → replaces manual pattern-matching with written conclusions  
- **Engagement Rate column** → views alone don't tell the full story; ER surfaces quality
- **Scatter chart** → lets users spot the engagement-views sweet spot visually
- **Shareable links** → first enterprise ask: "can I send this to my team?"
- **Quick-start buttons** → demo-first UX; removes friction from the first impression

### Phase 2 Roadmap

| Feature | Value |
|---|---|
| **Side-by-side channel comparison** | Compare 2–3 channels in the same view |
| **Historical trend chart** | 90-day rolling view velocity per channel |
| **Email / Slack alerts** | Notify when a competitor publishes above a view threshold |
| **Saved watchlist** | Persist a list of channels without re-entering URLs |
| **Embeddable widget** | Drop the chart into Notion, Confluence, or a dashboard |
| **GPT-powered insight summaries** | Upgrade rules-based insights with natural language generation |
| **Competitor gap analysis** | "They post 3×/week; you post 1×/week — here's the impact" |

### Known Limitations of MVP

- YouTube Data API v3 quota: 10,000 units/day. Each full analysis costs ~3–5 units.
- Subscriber counts reflect today's channel total, not at video-publish time.
- Videos returned are the 50 most recent uploads regardless of date range — older content in the table depends on channel upload frequency.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts     # YouTube API orchestration + mock fallback
│   ├── page.tsx                 # Entry point
│   └── globals.css              # Tailwind v4 base + dark variant
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Nav + dark mode toggle (Viblytics brand)
│   │   └── Footer.tsx
│   ├── ThemeProvider.tsx        # Context + localStorage dark mode
│   ├── DashboardContainer.tsx   # Hero, search, URL state, example buttons
│   ├── Dashboard.tsx            # Results layout
│   ├── ChannelSummaryCard.tsx   # Gradient card with 4 stat tiles
│   ├── ChannelInsights.tsx      # 4 rule-based written insights
│   ├── PerformanceChart.tsx     # Bar chart + Scatter chart tab toggle
│   ├── VideoTable.tsx           # Sort + filter + ER column + export
│   ├── ChannelInput.tsx         # URL input + recent channel chip
│   └── LoadingSkeleton.tsx      # Shimmer placeholders
└── types/index.ts               # Shared TypeScript interfaces
```

---

## 🏆 Stretch Goals Implemented

- ✅ **Shareable URLs** — `?channel=` param enables one-click sharing
- ✅ **Iterative git history** — each feature committed separately
- ✅ **Engagement Rate** — color-coded column, sortable, included in CSV export
- ✅ **Channel Insights** — replaces the need for GPT with deterministic rules that always work

## 💡 Additional Polish for Judges

1. **Metric Help Tooltips** — every column header has a `?` icon explaining what the metric means
2. **Responsive dark mode across all charts** — Recharts grid, tick, and cursor colors adapt via `useTheme()` at runtime

---

## 📄 License

MIT — free to use, fork, and extend.

---

## 👤 Author

Name: Farhan Abid

Email: farhankhan080304@gmail.com 


