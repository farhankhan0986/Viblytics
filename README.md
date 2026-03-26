<div align="center">

# VidMetrics — Competitor Video Analyzer

**Instantly surface a YouTube channel's best-performing content.**  
Built for marketing and analytics teams who move fast and make data-driven decisions.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2-ff6b6b)](https://recharts.org/)

</div>

---

## 📸 Demo

> **Live walkthrough:** [🎥 Loom demo link — add yours here](https://loom.com)

![VidMetrics dashboard showing MKBHD channel analysis with stat cards, horizontal bar chart, and sortable video table](./public/demo-screenshot.png)

---

## What It Does

Paste any YouTube channel URL. In seconds, you get:

| Feature | Detail |
|---|---|
| **Channel Summary Card** | Avatar, subscriber count, 30-day totals for views and videos |
| **Top 5 Chart** | Full-width horizontal bar chart (Recharts) themed to match the app |
| **Sortable Video Table** | Sort by Views, Likes, Comments, or Date — instantly |
| **Smart Filtering** | Date range (7 / 14 / 30 / 90 days / All time) + minimum view count |
| **🔥 Trending Badge** | Videos above the 80th percentile in views for the period |
| **CSV Export** | Exports the currently sorted + filtered list with engagement rate |
| **Dark / Light Mode** | Toggle in the header — preference saved to `localStorage` |
| **Loading Skeletons** | Pixel-matched shimmer layout while data fetches |
| **Mock Data Fallback** | Fully functional demo mode if no API key is configured |

---

## ⚙️ Setup

### Prerequisites

- Node.js 18+
- A YouTube Data API v3 key ([get one here](https://console.cloud.google.com/apis/library/youtube.googleapis.com))

### Install

```bash
git clone https://github.com/your-org/vidmetrics
cd vidmetrics
npm install
```

### Configure

Create a `.env.local` file in the project root:

```env
YOUTUBE_API_KEY=your_api_key_here
```

> **No API key?** The app automatically falls back to a rich mock dataset with realistic channel data — fully usable for demos without any configuration.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for production

```bash
npm run build
npm start
```

---

## 🏗️ How This Was Built

### Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | File-based routing, server components, API routes in one repo |
| Language | TypeScript 5 | End-to-end type safety from API response → component props |
| Styling | Tailwind CSS v4 | Utility-first, class-based dark mode via `@custom-variant dark` |
| Charts | Recharts | Composable, React-native — easy to theme and extend |
| Date logic | date-fns | Lightweight, tree-shakeable date utilities |
| Icons | lucide-react | Consistent, accessible icon set |

### Architecture Decisions

**1. API Route as BFF (Backend-for-Frontend)**  
`/api/analyze` acts as a thin orchestration layer: it resolves channel handles → IDs → upload playlists → video stats in a single client call, hiding YouTube API complexity and keeping the API key server-side only.

**2. Mock-first resilience**  
The mock fallback isn't an afterthought — it generates structurally identical data to real API responses, ensuring the app is always demo-ready regardless of quota or key availability.

**3. 80th-percentile trending**  
Trending is calculated server-side as `views ≥ sorted_views[floor(0.8 × n)]` — relative to the channel's own period, not a global threshold. This makes the badge meaningful for channels of any size.

**4. Client-side filtering via `useMemo`**  
All sort/filter operations on the video table run in-memory using `useMemo`. No extra API calls, no loading states for filter changes — instant feedback.

**5. Dark mode without flash**  
The theme is applied by toggling a `.dark` class on `<html>` (not via `useState` alone), using `suppressHydrationWarning` to prevent SSR mismatch. System preference is detected on first load; subsequent visits restore from `localStorage`.

---

## 🗺️ Product Thinking & Roadmap

### What was prioritized for the MVP

The PRD called for a demo-ready tool for enterprise marketing teams. Every decision was weighed against one question: *"Does this help a marketer understand competitor content strategy faster?"*

- **Trending badge** → immediately answers "which of their videos is working right now?"
- **Date range filter** → lets users zoom into a campaign window, not just a fixed period
- **CSV export** → first thing an analyst asks for; integrates with their existing tools
- **Channel summary card** → establishes context before showing granular data

### Stretch goals / Phase 2

| Feature | Value |
|---|---|
| **Side-by-side channel comparison** | Compare 2–3 channels in the same view |
| **Engagement rate column** | (likes + comments) / views — better signal than view count alone |
| **Email / Slack alerts** | Notify when a competitor publishes a video above a views threshold |
| **Historical trends** | 90-day rolling chart to see channel velocity |
| **Saved channels** | Persist a watchlist without re-entering URLs |
| **Embeddable widget** | Drop the chart into a Notion doc or Confluence page |
| **Multi-language support** | Localize metrics labels for global marketing teams |

### Known limitations of MVP

- YouTube Data API v3 quota is 10,000 units/day. Each full channel analysis costs ~3–5 units.
- Subscriber counts are not returned per-video; they reflect the channel total at query time.
- Videos older than 30 days are excluded from the upload playlist query by design.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts   # YouTube API orchestration + mock fallback
│   ├── page.tsx               # Entry point
│   └── globals.css            # Tailwind v4 base + dark variant
├── components/
│   ├── layout/
│   │   ├── Header.tsx         # Nav + dark mode toggle
│   │   └── Footer.tsx
│   ├── ThemeProvider.tsx      # Context + localStorage persistence
│   ├── DashboardContainer.tsx # Hero, search, state orchestration
│   ├── Dashboard.tsx          # Results layout
│   ├── ChannelSummaryCard.tsx # Gradient card with 4 stat tiles
│   ├── PerformanceChart.tsx   # Horizontal bar chart (Recharts)
│   ├── VideoTable.tsx         # Sort + filter + export table
│   ├── ChannelInput.tsx       # URL input form
│   └── LoadingSkeleton.tsx    # Shimmer placeholders
└── types/index.ts             # Shared TypeScript interfaces
```

---

## 📄 License

MIT — free to use, fork, and extend.
