# ArcScore: marketing site

Landing page for [arcscore.ai](https://arcscore.ai): the valuation and placement engine for college NIL.
The business audit, competitor landscape and product blueprint are in [`docs/AUDIT.md`](docs/AUDIT.md).

## Stack

- **Vite + React 19 + TypeScript**, **Tailwind CSS v4**, **Framer Motion**
- **three.js / React Three Fiber / drei / postprocessing** for the 3D scenes (`src/components/three/`)
- 21st.dev-style UI primitives in `src/components/ui/` (Spotlight, Number Ticker, Marquee, Shimmer Button, Tilt Card, Glow Card, Animated Beam, Text Effect)
- **Cloudflare Worker** (`worker/index.ts`, Hono) serves the static build and `/api/*`

## Develop

```bash
npm install
npm run dev        # Vite on :5173 (proxies /api to :8787)
npx wrangler dev   # in a second terminal, for the API (serves ./dist)
```

`npm run preview` builds the site and runs it on the real Workers runtime.

## Deploy to Cloudflare

```bash
npx wrangler login
npm run deploy     # vite build + wrangler deploy
```

Then add `arcscore.ai` as a custom domain on the `arcscore-web` Worker in the Cloudflare dashboard.

### Continuous deploys (Workers Builds)

In the Cloudflare dashboard: **Workers & Pages → Create → Import a repository → `byw1/arcscore`**.
Use Worker name `arcscore-web`, build command `npm run build`, deploy command `npx wrangler deploy`.
Every push to `main` then deploys, and other branches get preview URLs.

### Leads database

Leads are stored in the D1 database `arcscore` (bound as `DB`, already created; schema in `migrations/`).

```bash
npx wrangler d1 migrations apply arcscore --local    # local dev
npx wrangler d1 migrations apply arcscore --remote   # after adding a new migration
npx wrangler d1 execute arcscore --remote --command "select * from leads order by created_at desc limit 20"
```

## API

| Method | Path | Body |
|---|---|---|
| GET | `/api/health` | none |
| POST | `/api/leads` | `{ email, audience: "brand" \| "school" \| "athlete" \| "investor", name?, org?, message?, source? }` |
