// Route chunks, shared by the router (lazy) and the landing page (prefetch).
export const loadLogin = () => import("@/site/Login");
export const loadShell = () => import("@/app/Shell");
export const loadOverview = () => import("@/app/pages/Overview");
export const loadArcScene = () => import("@/components/three/ArcScene");

/** Warm the demo app once the landing page has settled, so "Try the demo" is instant. */
export function prefetchApp() {
  const run = () => {
    loadLogin();
    loadShell();
    loadOverview();
  };
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 4000 });
  else setTimeout(run, 2500);
}

/** 3D is an enhancement: skip it for data-saver users and very slow connections. */
export function canAfford3D() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (c?.saveData) return false;
  if (c?.effectiveType && /(^|-)2g$|3g/.test(c.effectiveType)) return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
