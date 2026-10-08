# ArcScore: concept site and demo app

A rebrand and clickable product demo for [arcscore.ai](https://arcscore.ai). Everything runs in the browser on fictional demo data; there is no backend database.

- `/` is the landing page
- `/login` is the demo sign-in (credentials pre-filled), with one-click entry to three workspaces:
  - **Northline Hydration** (brand): overview, Discover (brief → ranked matches), Athletes, Campaigns (pipeline board), Deal files
  - **Lakeshore State Athletics** (school): overview, Roster value (revenue-share modeling vs. the cap with portal risk), Athletes, Deal files
  - **Northline Hydration** also has a 3-step **New campaign** wizard (brief → audience → Arc's picks)
  - **Jordan Ellis** (athlete): My score, Opportunities (accept or decline offers), My deals, and a shareable public **media kit** at `/kit/a000`
  - **ArcScore HQ** (internal admin): client accounts with health and usage (open any demo workspace as that client), the **score model** (re-weight factors and preview ranking changes before publishing), data-source health, and an audit log
  - Every workspace: Team management (invite, roles, remove), Settings, notifications, ⌘K athlete search, and the Ask Arc assistant
- Changes (moving deals, invites, allocations) persist in `localStorage`. Use **Reset demo** to start over.

Brand system: [`docs/BRAND.md`](docs/BRAND.md). Business audit and competitive landscape: [`docs/AUDIT.md`](docs/AUDIT.md).

## Stack
Vite, React 19, TypeScript, Tailwind CSS v4, Framer Motion and React Router, served by a Cloudflare Worker with static assets (`worker/index.ts`).

- Demo data: `src/demo/data.ts` (deterministic, seeded)
- Demo state: `src/demo/store.tsx`
- Product: `src/app/`
- Marketing pages: `src/site/`

## Performance
- Only React, the animation library and the landing page load up front (about 155KB gzipped). Each demo page is its own chunk and is prefetched once the landing page is idle.
- The 3D scene (three.js, about 290KB gzipped) loads after first paint, behind an SVG poster that paints instantly, and fades in when its first frame is ready. It is skipped for data-saver, 2G/3G and reduced-motion visitors. Phones get a lighter scene (no reflections or bloom), and resolution steps down automatically if frame rate drops.
- Hashed assets are served straight from Cloudflare's edge with a one-year immutable cache. Only HTML goes through the Worker.

## Develop
```bash
npm install
npm run dev        # http://localhost:5173
npm run preview    # build and run on the Workers runtime
```

## Deploy (Cloudflare Workers Builds)
In the Cloudflare dashboard, go to **Workers & Pages → Create → Import a repository → `byw1/arcscore`**. Use Worker name `arcscore-web`, build command `npm run build` and deploy command `npx wrangler deploy`. Every host except `arcscore.ai` is served with `X-Robots-Tag: noindex`.
