import type { Athlete } from "./data";

/** Brief → athlete fit, shared by Discover and the campaign wizard. */
export type Age = "13–17" | "18–24" | "25–34";
export const AGE_I: Record<Age, number> = { "13–17": 0, "18–24": 1, "25–34": 2 };
export const REGIONS = ["Anywhere", "Midwest", "Southeast", "Texas", "California", "Northeast"];
const REGION_CITIES: Record<string, string[]> = {
  Midwest: ["Chicago", "Columbus", "Omaha", "Detroit", "Midwest"],
  Southeast: ["Atlanta", "Miami", "Charlotte", "Nashville", "Southeast"],
  Texas: ["Dallas", "Houston", "Texas"],
  California: ["Los Angeles", "San Diego", "California"],
  Northeast: ["Brooklyn", "Northeast"],
};

export function fitFor(a: Athlete, age: Age, region: string, category: string, cap: number) {
  const ageFit = a.ageMix[AGE_I[age]] / 55;
  const regionFit = region === "Anywhere" ? 1 : a.topRegions.some((r) => REGION_CITIES[region].some((c) => r.includes(c))) ? 1 : 0.55;
  const cat = a.affinity.find((x) => x.category === category)?.score ?? a.factors.fit - 15;
  const price = a.fmv[0] <= cap ? 1 : 0.4;
  const raw = (cat / 100) * 0.45 + Math.min(1, ageFit) * 0.25 + regionFit * 0.2 + (a.factors.integrity / 100) * 0.1;
  return Math.round(Math.min(99, raw * 100 * price + Math.max(0, a.arc) * 0.4));
}

