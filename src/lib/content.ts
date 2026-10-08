import type { Factor } from "@/components/three/ScoreCore";

export const APP_URL = "https://app.arcscore.ai/sign-in";

/** The six signal families behind every ArcScore. Values are for the sample profile shown on the page. */
export const FACTORS: (Factor & { desc: string; signals: string[] })[] = [
  { key: "reach", label: "Reach", value: 82, color: "#5ad1ff", desc: "Deduplicated audience across every platform, filtered for bots and purchased followers.", signals: ["Cross-platform audience", "Follower authenticity", "Impressions per post"] },
  { key: "resonance", label: "Resonance", value: 91, color: "#c6ff3d", desc: "How hard the audience leans in: saves, shares, comment quality and sentiment, not just likes.", signals: ["Engagement quality", "Comment sentiment", "Share & save rate"] },
  { key: "performance", label: "Performance", value: 86, color: "#9b7bff", desc: "On-field output normalized by sport, position, conference and minutes, so a libero and a linebacker compare fairly.", signals: ["Position-normalized stats", "Strength of schedule", "Award & ranking signals"] },
  { key: "momentum", label: "Momentum", value: 94, color: "#ff7a3d", desc: "The slope of the arc: audience growth, media velocity, postseason exposure and draft stock.", signals: ["30/90-day growth", "Media mentions", "TV & postseason exposure"] },
  { key: "fit", label: "Market Fit", value: 88, color: "#5ad1ff", desc: "Who the audience actually is (age, region, interests) matched against each brand's customer file.", signals: ["Audience demographics", "Geo & DMA overlap", "Category affinity"] },
  { key: "integrity", label: "Integrity", value: 79, color: "#c6ff3d", desc: "Brand safety, content history, reliability on past deliverables and compliance readiness.", signals: ["Content safety scan", "Deliverable reliability", "NIL Go readiness"] },
];

export const MARKET_STATS = [
  { value: 4.5, prefix: "$", suffix: "B", decimals: 1, label: "Projected payments to college athletes in 2026–27", source: "Opendorse estimate, June 2026" },
  { value: 20.5, prefix: "$", suffix: "M", decimals: 1, label: "Revenue-share cap per school in year one, rising each year", source: "House v. NCAA settlement" },
  { value: 204255, prefix: "", suffix: "", decimals: 0, label: "Division I athletes, the majority of them unpriced", source: "NCAA, 2024–25" },
  { value: 90, prefix: "~$", suffix: "M", decimals: 0, label: "In NIL deals rejected by NIL Go in its first year", source: "ESPN, June 2026" },
];
