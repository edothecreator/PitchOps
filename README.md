# PitchOps ⚽

A production-grade football analytics dashboard — live standings, match results, player statistics and detailed match breakdowns for the top 5 European leagues, the UEFA Champions League and Europa League.

**Live at [pitchopsss.xyz](https://pitchopsss.xyz)**

![PitchOps Dashboard](./screenshots/dashboard.png)

---

## Features

- **7 competitions** — Premier League, La Liga, Bundesliga, Serie A, Ligue 1, UCL, Europa League
- **15 seasons** — browse any season from 2010 to 2024/25
- **Full standings tables** — sortable by any column, qualification zone markers (UCL / UEL / UECL / Relegation)
- **Match detail panel** — events timeline, possession/shots/xG stats, lineups, head-to-head history, match predictions
- **Player leaderboards** — top scorers, assists, yellow cards with medal rankings
- **Team analytics** — win rate, form guide, goal timing chart, formations breakdown
- **Dark terminal aesthetic** — tabular numerals, shimmer skeletons, zero generic spinners

---

## Architecture

```
Browser (Static SPA)
    │
    ▼
AWS CloudFront (CDN + HTTPS)
    │
    ├──► S3 Bucket (Next.js static export)
    │
    └──► api.pitchopsss.xyz
              │
              ▼
         EC2 (eu-west-3)
              ├── FastAPI container (port 8000)
              └── PostgreSQL container (port 5432)
                        │
                        ▼
                  API-Football v3
```

The frontend **never calls API-Football directly**. The EC2 backend holds the API key server-side and proxies all requests. Swapping data providers is a one-file backend change.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14, App Router, TypeScript |
| Styling | Tailwind CSS v3 |
| Data fetching | TanStack Query v5 |
| Build output | Static export (`output: 'export'`) |
| Backend | FastAPI (Python), Uvicorn |
| Cache | In-memory TTL (24h historical, 1h standings) |
| Database | PostgreSQL 16 |
| Containers | Docker + Docker Compose |
| CDN | AWS CloudFront |
| Storage | AWS S3 |
| Compute | AWS EC2 |
| SSL (frontend) | AWS ACM |
| SSL (backend) | Let's Encrypt + Certbot + Nginx |
| Domain | Spaceship.com |
| Data source | API-Football v3 |

---

## Pages

### `/` — Overview Dashboard
Recent results strip, standings snapshots for all 6 competitions, top scorers tickers.

### `/standings` — Full Tables
Sortable league tables with qualification zone markers. Switch between 7 leagues and seasons 2010–2024.

### `/matches` — Results + Detail
Paginated results list. Click any match to open a 5-tab detail panel:
- **Events** — goals, cards, substitutions with minute and player name
- **Stats** — possession, shots, corners, pass accuracy, xG (side-by-side bars)
- **Lineups** — starting XI, subs, formation and coach for both teams
- **H2H** — all-time head-to-head record, win percentages, recent meetings
- **Prediction** — win probability bar, attack/defense/form comparison

### `/statistics` — Analytics
Top scorers, top assists, discipline leaderboards. Team stats: win rate, form guide (last 10), goal timing bar chart, preferred formations.

---

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server (uses mock data by default)
npm run dev

# Production static export
npm run build
# → output in /out directory
```

### Environment Variables

```bash
# .env.local

# Your EC2 backend URL
NEXT_PUBLIC_API_BASE_URL=https://api.pitchopsss.xyz

# "true" = use local mock data (no backend needed for dev/demo)
NEXT_PUBLIC_USE_MOCK_DATA=true
```

Set `NEXT_PUBLIC_USE_MOCK_DATA=true` to run the full UI without any backend. All hooks fall back to realistic local JSON in `src/data/mock/`.

---

## Project Structure

```
src/
├── app/                    Pages (/, /standings, /matches, /statistics)
├── components/
│   ├── layout/             Sidebar, Header, MobileNav, AppShell
│   ├── ui/                 Badge, Skeleton, Card, Tabs, ProgressBar, ...
│   ├── dashboard/          RecentResultsStrip, StandingsSnapshot, TopScorersTicker
│   ├── standings/          StandingsTable (sortable, zone markers)
│   ├── matches/            FixtureCard, MatchEvents, MatchStats, MatchLineups,
│   │                       H2HCard, PredictionCard, ResultsList
│   └── statistics/         TopScorersTable, TeamStatsCard
├── hooks/                  TanStack Query hooks for all data
├── lib/
│   ├── api/client.ts       Typed fetch functions (one per backend endpoint)
│   ├── api/types.ts        Full TypeScript response types
│   ├── utils.ts            cn(), date/status helpers
│   └── constants.ts        League IDs, seasons list
└── data/mock/              Local mock data (realistic La Liga + CL data)
```

---

## Backend API Contract

The frontend calls these endpoints on the EC2 backend:

```
GET /standings?league={id}&season={year}
GET /fixtures?league={id}&season={year}&from={date}&to={date}
GET /fixtures/{id}/events
GET /fixtures/{id}/statistics
GET /fixtures/{id}/lineups
GET /fixtures/{id}/h2h
GET /fixtures/{id}/prediction
GET /statistics/top-scorers?league={id}&season={year}
GET /statistics/top-assists?league={id}&season={year}
GET /statistics/top-yellowcards?league={id}&season={year}
GET /statistics/team/{id}?league={id}&season={year}
```

All responses are normalized server-side before reaching the frontend.

---

## Deployment

### S3 + CloudFront (Frontend)

```bash
npm run build
aws s3 sync out/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

**Critical CloudFront config** — add these Error Pages or hard refreshes on deep routes fail:

| HTTP error | Response path | Response code |
|---|---|---|
| 403 | /index.html | 200 |
| 404 | /index.html | 200 |

### EC2 (Backend)

```bash
# On EC2
git clone your-backend-repo
cd pitchops-backend

# Set environment variables in docker-compose.yml
# FOOTBALL_API_KEY, FRONTEND_ORIGIN, DB credentials

docker compose up -d
```

### HTTPS on EC2 (Nginx + Certbot)

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

Requires port 80 open in security group for ACME challenge.

---

## Design System

| Token | Value | Usage |
|---|---|---|
| `base` | `#0b0f19` | Page background |
| `surface` | `#111827` | Cards, panels |
| `accent` | `#22c55e` | Active nav, CTAs |
| `accent-blue` | `#3b82f6` | UCL zone, secondary charts |
| `zone-ucl` | `#3b82f6` | Champions League row marker |
| `zone-uel` | `#f97316` | Europa League row marker |
| `zone-uecl` | `#a78bfa` | Conference League row marker |
| `zone-relegation` | `#ef4444` | Relegation row marker |

Typography: Inter with `font-variant-numeric: tabular-nums` on all stats so digits align in columns.

---

## API-Football Free Plan Notes

- 100 requests/day — preserved by server-side TTL cache
- No `?last=N` parameter — use `from/to` date ranges instead
- Logo/image calls are free (don't count toward quota)
- Historical seasons back to 2010 available

---

## Cost

| Resource | Cost |
|---|---|
| Domain (pitchopsss.xyz) | $1.86/year |
| EC2 t3.micro | ~$10/month |
| S3 + CloudFront | ~$0.50/month |
| ACM + Let's Encrypt | Free |
| API-Football | Free |
| **Total** | **~$12/month** |

---

## License

MIT
