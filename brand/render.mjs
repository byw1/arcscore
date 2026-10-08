// Renders the share image and app icons from brand/og.html and public/favicon.svg.
// Usage: node brand/render.mjs   (needs Playwright + Chromium)
import { createRequire } from "module";
import { readFileSync } from "fs";
const require = createRequire(process.env.PLAYWRIGHT_MODULE_DIR ?? import.meta.url);
const { chromium } = require("playwright");
const root = new URL("..", import.meta.url).pathname;
const browser = await chromium.launch();

const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await og.goto("file://" + root + "brand/og.html", { waitUntil: "networkidle" });
await og.evaluate(() => document.fonts.ready);
await og.screenshot({ path: root + "public/og.png" });

const svg = readFileSync(root + "public/favicon.svg", "utf8");
for (const [name, size, pad] of [["apple-touch-icon.png", 180, 0], ["icon-192.png", 192, 0], ["icon-512.png", 512, 0], ["icon-maskable-512.png", 512, 0.12], ["favicon-32.png", 32, 0], ["favicon-16.png", 16, 0]]) {
  const p = await browser.newPage({ viewport: { width: size, height: size } });
  const inset = Math.round(size * pad);
  // Apple and maskable icons get a full-bleed background (the OS applies its own rounding).
  const full = name.startsWith("apple") || name.includes("maskable");
  const body = full
    ? `<div style="width:${size}px;height:${size}px;background:#070b18;display:grid;place-items:center">${svg.replace('<rect width="64" height="64" rx="15" fill="#070b18"/>', "").replace("<svg", `<svg width="${size - inset * 2}" height="${size - inset * 2}"`)}</div>`
    : svg.replace("<svg", `<svg width="${size}" height="${size}"`);
  await p.setContent(`<html><body style="margin:0;background:transparent">${body}</body></html>`);
  await p.screenshot({ path: root + "public/" + name, omitBackground: !full });
  await p.close();
}
await browser.close();
console.log("rendered");
