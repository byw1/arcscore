# ArcScore: concept site and demo app

A rebrand and clickable product demo for [arcscore.ai](https://arcscore.ai). Everything runs in the browser on fictional demo data; there is no backend database.

- `/` is the landing page
- `/login` is the demo sign-in (credentials pre-filled), with one-click entry to three workspaces:
  - **Northline Hydration** (brand): overview, Discover (brief → ranked matches), Athletes, Campaigns (pipeline board), Deal files
  - **Lakeshore State Athletics** (school): overview, Roster value (revenue-share modeling vs. the cap with portal risk), Athletes, Deal files
  - **Jordan Ellis** (athlete): My score, Opportunities (accept or decline offers), My deals
  - All three: Team management (invite, roles, remove), Settings, ⌘K athlete search, and the Ask Arc assistant
- Changes (moving deals, invites, allocations) persist in `localStorage`. Use **Reset demo** to start over.

Brand system: [`docs/BRAND.md`](docs/BRAND.md). Business audit and competitive landscape: [`docs/AUDIT.md`](docs/AUDIT.md).

## Stack
Vite, React 19, TypeScript, Tailwind CSS v4, Framer Motion and React Router, served by a Cloudflare Worker with static assets (`worker/index.ts`).

- Demo data: `src/demo/data.ts` (deterministic, seeded)
- Demo state: `src/demo/store.tsx`
- Product: `src/app/`
- Marketing pages: `src/site/`

## Develop
```bash
npm install
npm run dev        # http://localhost:5173
npm run preview    # build and run on the Workers runtime
```

## Deploy (Cloudflare Workers Builds)
In the Cloudflare dashboard, go to **Workers & Pages → Create → Import a repository → `byw1/arcscore`**. Use Worker name `arcscore-web`, build command `npm run build` and deploy command `npx wrangler deploy`. Every host except `arcscore.ai` is served with `X-Robots-Tag: noindex`.
