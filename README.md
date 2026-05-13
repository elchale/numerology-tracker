# Numen

A personal numerology calendar. Enter your birth date once, then explore your **personal year, month, and day** across a full calendar — plus a cheat sheet covering every life path, master number, and karmic lesson.

100% client-side. All data lives in `localStorage` on your device. No server, no tracking, no account.

## Stack

- **Next.js 16** (App Router, Turbopack, fully static export)
- **React 19** with TypeScript (strict)
- **Tailwind CSS v4** (`@theme` design tokens, custom utilities)
- **Zustand** with `persist` middleware for `localStorage`
- `next/font/google` for self-hosted Fraunces + Inter
- Dynamic OG-style icons via `next/og`

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Today's full reading: PY / PM / PD, day archetype, do/avoid, life path, lucky days ahead |
| `/calendar` | Month grid with per-day numerology and a detail modal |
| `/year` | 12-month overview with heatmap-style minis |
| `/timeline` | Lifetime view of personal years, master years and life-path years highlighted |
| `/cheatsheet` | Reference for all 1–9 numbers, master numbers, day types, karmic numbers, 9-year cycle |
| `/settings` | Birth date + optional time + name. Edit or clear at any time |

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. On first visit you'll be sent to `/settings` to enter your birth date.

## Other scripts

```bash
npm run build     # production build (Turbopack)
npm run start     # serve the production build
npm run lint      # ESLint with next/core-web-vitals + typescript rules
```

## Deploy to Vercel

The project is a zero-config Vercel deploy.

```bash
# from the project root
npx vercel
# follow prompts; subsequent pushes auto-deploy
```

Or via the dashboard:

1. Push the repo to GitHub.
2. <https://vercel.com/new> → import the repo.
3. Vercel auto-detects Next.js, no env vars needed.
4. Hit deploy.

All routes are statically prerendered, so the entire site serves from the edge CDN.

## Architecture notes

- **Numerology engine** (`src/lib/numerology.ts`) is pure and deterministic. Every page derives data from `birth` + a target date — no caching layer needed.
- **Master numbers** (11, 22, 33) are preserved through reduction.
- **Karmic numbers** (13, 14, 16, 19) are detected from the pre-final reduction step (see `reduceTrack`).
- **State** lives in one Zustand store (`src/store/useConfig.ts`). Hydration is gated through `useHydrated()` using `useSyncExternalStore`, so SSR and client paint stay consistent.
- **The day-detail modal** renders through `createPortal` directly to `document.body` so it escapes any parent stacking context.
- **Design tokens** (colors, fonts, shadows) live in the `@theme` block in `src/app/globals.css` — change once, propagate everywhere.

## File map

```
src/
├─ app/
│  ├─ layout.tsx            # Root layout, fonts, metadata, skip link
│  ├─ globals.css           # Tailwind v4 + design tokens
│  ├─ page.tsx              # Dashboard (Today)
│  ├─ error.tsx             # Error boundary
│  ├─ loading.tsx           # Loading skeleton
│  ├─ not-found.tsx         # 404
│  ├─ icon.tsx              # 32x32 favicon (next/og)
│  ├─ apple-icon.tsx        # 180x180 Apple touch icon
│  ├─ manifest.ts           # PWA manifest
│  ├─ robots.ts             # robots.txt
│  ├─ calendar/             # page + layout (metadata)
│  ├─ cheatsheet/
│  ├─ settings/
│  ├─ timeline/
│  └─ year/
├─ components/
│  ├─ Header.tsx
│  ├─ NavTabs.tsx
│  ├─ RequireConfig.tsx     # Hydration + birth-date gate
│  ├─ NumberCard.tsx
│  ├─ DayBadge.tsx
│  ├─ calendar/
│  │  ├─ MonthView.tsx
│  │  ├─ DayCell.tsx
│  │  └─ DayDetail.tsx      # Portal modal
│  ├─ year/MonthMini.tsx
│  └─ timeline/YearTimeline.tsx
├─ lib/
│  ├─ numerology.ts         # Pure engine
│  ├─ meanings.ts           # All copy: life paths, day types, karmic notes
│  └─ types.ts
└─ store/
   └─ useConfig.ts          # Zustand + persist + useHydrated()
```

## License

MIT.
