/*
  Demo dataset. Everything here is fictional and generated deterministically
  from a fixed seed, so every visitor sees the same numbers.
*/

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261008);
const pick = <T,>(a: readonly T[]) => a[Math.floor(rand() * a.length)];
const between = (lo: number, hi: number) => lo + rand() * (hi - lo);
const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));
const round = (v: number, step = 1) => Math.round(v / step) * step;

export type FactorKey = "reach" | "resonance" | "performance" | "momentum" | "fit" | "integrity";
export const FACTOR_META: { key: FactorKey; label: string; hint: string }[] = [
  { key: "reach", label: "Reach", hint: "Real, deduplicated audience across platforms" },
  { key: "resonance", label: "Resonance", hint: "Engagement quality, sentiment, shares and saves" },
  { key: "performance", label: "Performance", hint: "On-field output, normalized by sport and position" },
  { key: "momentum", label: "Momentum", hint: "Growth velocity, media and postseason exposure" },
  { key: "fit", label: "Market fit", hint: "Audience age, region and interests vs. brand customers" },
  { key: "integrity", label: "Integrity", hint: "Brand safety, reliability, compliance readiness" },
];

export type Tier = "Power 4" | "Group of 6";
export type School = { id: string; name: string; short: string; tier: Tier; city: string };
export const SCHOOLS: School[] = [
  { id: "lsu", name: "Lakeshore State", short: "LKS", tier: "Power 4", city: "Chicago, IL" },
  { id: "rvu", name: "Ridgeview University", short: "RDG", tier: "Power 4", city: "Columbus, OH" },
  { id: "pct", name: "Pacific Coast Tech", short: "PCT", tier: "Power 4", city: "San Diego, CA" },
  { id: "chu", name: "Carolina Harbor", short: "CHB", tier: "Power 4", city: "Charlotte, NC" },
  { id: "mvs", name: "Mesa Valley State", short: "MVS", tier: "Group of 6", city: "Phoenix, AZ" },
  { id: "npu", name: "Northern Plains", short: "NPU", tier: "Group of 6", city: "Omaha, NE" },
  { id: "gcu", name: "Gulf Coast University", short: "GCU", tier: "Power 4", city: "Houston, TX" },
];

const SPORTS: { sport: string; positions: string[]; women?: boolean; weight: number }[] = [
  { sport: "Football", positions: ["QB", "WR", "RB", "LB", "CB", "TE", "EDGE"], weight: 5 },
  { sport: "Men's basketball", positions: ["G", "F", "C"], weight: 2 },
  { sport: "Women's basketball", positions: ["G", "F", "C"], women: true, weight: 2 },
  { sport: "Volleyball", positions: ["OH", "Setter", "Libero", "MB"], women: true, weight: 2 },
  { sport: "Gymnastics", positions: ["All-around", "Vault", "Floor"], women: true, weight: 1 },
  { sport: "Softball", positions: ["P", "SS", "OF"], women: true, weight: 1 },
  { sport: "Baseball", positions: ["P", "SS", "OF", "C"], weight: 1 },
  { sport: "Soccer", positions: ["F", "M", "D", "GK"], women: true, weight: 2 },
  { sport: "Track & field", positions: ["Sprints", "Jumps", "Distance"], weight: 1 },
];
const SPORT_POOL = SPORTS.flatMap((s) => Array(s.weight).fill(s) as typeof SPORTS);

const FIRST_M = ["Jaylen", "Malik", "Cole", "Andre", "Tyler", "Isaiah", "Marcus", "Eli", "Jalen", "Noah", "Caleb", "Devin", "Luca", "Mason", "Darius", "Theo", "Xavier", "Owen"];
const FIRST_W = ["Avery", "Maya", "Sienna", "Kennedy", "Jada", "Riley", "Nia", "Camille", "Harper", "Talia", "Brooke", "Imani", "Lena", "Quinn", "Zoe", "Aaliyah", "Elena", "Paige"];
const LAST = ["Ellis", "Okafor", "Rivera", "Nguyen", "Brooks", "Hart", "Coleman", "Price", "Delgado", "Foster", "Reyes", "Whitaker", "Bennett", "Sato", "Mercer", "Lowe", "Hayes", "Grant", "Ibarra", "Campbell", "Shaw", "Moreau", "Vance", "Achebe", "Lindqvist", "Park"];
const CLASSES = ["Fr", "So", "Jr", "Sr", "Gr"];
const HOMETOWNS = ["Atlanta, GA", "Dallas, TX", "Los Angeles, CA", "Chicago, IL", "Miami, FL", "Seattle, WA", "Detroit, MI", "Denver, CO", "Nashville, TN", "Phoenix, AZ", "Brooklyn, NY", "Charlotte, NC"];
export const CATEGORIES = ["Hydration", "Apparel", "Fitness", "Regional auto", "Fintech", "Beauty", "Gaming", "QSR", "Telecom", "Local retail"] as const;

export type Athlete = {
  id: string;
  name: string;
  initials: string;
  sport: string;
  position: string;
  year: string;
  schoolId: string;
  hometown: string;
  score: number;
  arc: number; // projected 12-month change in score
  factors: Record<FactorKey, number>;
  followers: { instagram: number; tiktok: number; x: number; youtube: number };
  audience: number; // deduplicated real audience
  authenticity: number; // % of audience that is real
  engagement: number; // %
  fmv: [number, number]; // per standard campaign, USD
  history: number[]; // 26 weekly score points, oldest first
  ageMix: [number, number, number, number]; // 13-17, 18-24, 25-34, 35+
  topRegions: string[];
  affinity: { category: string; score: number }[];
  revShare: number; // school revenue-share allocation, USD/yr
  portalRisk: "Low" | "Elevated" | "High";
  available: boolean;
};

function makeAthlete(i: number, fixed?: Partial<Athlete> & { sportName?: string }): Athlete {
  const s = fixed?.sportName ? SPORTS.find((x) => x.sport === fixed.sportName)! : pick(SPORT_POOL);
  const women = s.women ?? false;
  const first = pick(women ? FIRST_W : FIRST_M);
  const last = pick(LAST);
  const name = fixed?.name ?? `${first} ${last}`;
  const schoolId = fixed?.schoolId ?? (i < 34 ? "lsu" : pick(SCHOOLS).id);
  const tierBoost = SCHOOLS.find((x) => x.id === schoolId)!.tier === "Power 4" ? 6 : -6;

  const base = clamp(between(48, 86) + tierBoost * 0.5 + (s.sport === "Football" ? 3 : 0));
  const factors = {
    reach: round(clamp(base + between(-14, 12))),
    resonance: round(clamp(base + between(-8, 14) + (women ? 4 : 0))),
    performance: round(clamp(base + between(-12, 12))),
    momentum: round(clamp(base + between(-18, 16))),
    fit: round(clamp(base + between(-10, 12))),
    integrity: round(clamp(between(68, 98))),
  };
  const score = fixed?.score ?? round(
    factors.reach * 0.22 + factors.resonance * 0.2 + factors.performance * 0.18 + factors.momentum * 0.16 + factors.fit * 0.14 + factors.integrity * 0.1
  );
  const arc = fixed?.arc ?? round((factors.momentum - 62) / 3 + between(-5, 7));

  const audience = round(Math.pow(10, 3.6 + (factors.reach / 100) * 2.4), 100);
  const followers = {
    instagram: round(audience * between(0.45, 0.7), 100),
    tiktok: round(audience * between(0.2, 0.6), 100),
    x: round(audience * between(0.05, 0.2), 100),
    youtube: round(audience * between(0, 0.08), 100),
  };
  const engagement = Math.round((2 + (factors.resonance / 100) * 8 + between(-1, 1)) * 10) / 10;
  const mid = Math.max(600, (audience / 1000) * between(18, 34) * (0.6 + factors.fit / 100) * (s.sport === "Football" ? 1.25 : 1));
  const fmv: [number, number] = [round(mid * 0.82, mid > 10000 ? 1000 : 500), round(mid * 1.18, mid > 10000 ? 1000 : 500)];

  const history: number[] = [];
  let v = score - arc * 0.9 - between(2, 6);
  for (let w = 0; w < 26; w++) {
    v += (score - v) / (26 - w) + between(-1.4, 1.4);
    history.push(Math.round(clamp(v) * 10) / 10);
  }
  history[25] = score;

  const a = between(0.08, 0.2), b = between(0.38, 0.55), c = between(0.16, 0.28);
  const ageMix: Athlete["ageMix"] = [a, b, c, Math.max(0.04, 1 - a - b - c)].map((x) => Math.round(x * 100)) as Athlete["ageMix"];
  const home = fixed?.hometown ?? pick(HOMETOWNS);
  const school = SCHOOLS.find((x) => x.id === schoolId)!;
  const affinity = [...CATEGORIES]
    .map((category) => ({ category, score: round(clamp(factors.fit + between(-22, 10))) }))
    .sort((x, y) => y.score - x.score)
    .slice(0, 5);

  return {
    id: `a${String(i).padStart(3, "0")}`,
    name,
    initials: name.split(" ").map((p) => p[0]).join(""),
    sport: s.sport,
    position: fixed?.position ?? pick(s.positions),
    year: pick(CLASSES),
    schoolId,
    hometown: home,
    score: clamp(score),
    arc,
    factors,
    followers,
    audience,
    authenticity: round(between(84, 98)),
    engagement,
    fmv,
    history,
    ageMix,
    topRegions: [school.city.split(", ")[0] + " DMA", home.split(", ")[0] + " DMA", pick(["Texas", "Southeast", "Midwest", "California", "Northeast"])],
    affinity,
    revShare: schoolId === "lsu" ? round((s.sport === "Football" ? between(60, 900) : between(15, 160)) * 1000, 5000) : 0,
    portalRisk: "Low",
    available: rand() > 0.25,
    ...fixed,
  } as Athlete;
}

export const ATHLETES: Athlete[] = Array.from({ length: 84 }, (_, i) =>
  i === 0
    ? makeAthlete(0, { name: "Jordan Ellis", sportName: "Football", position: "WR", schoolId: "lsu", hometown: "Atlanta, GA", score: 87, arc: 12 })
    : makeAthlete(i)
);
// Jordan Ellis is the athlete persona: make the profile tell a clean story.
Object.assign(ATHLETES[0], {
  initials: "JE",
  year: "Jr",
  factors: { reach: 82, resonance: 91, performance: 86, momentum: 94, fit: 88, integrity: 79 },
  audience: 412000,
  followers: { instagram: 238000, tiktok: 151000, x: 41000, youtube: 9200 },
  engagement: 7.9,
  authenticity: 94,
  fmv: [18000, 26000],
  revShare: 410000,
  available: true,
});

export const REV_SHARE_CAP = 20_500_000;

/** What an athlete would command on the open market per year (revenue share + NIL). */
export const marketValue = (a: Athlete) => Math.round(((a.fmv[0] + a.fmv[1]) / 2) * 40 / 5000) * 5000;
export const riskFor = (share: number, a: Athlete): Athlete["portalRisk"] => {
  const r = share / Math.max(1, marketValue(a));
  return r < 0.55 && a.score > 72 ? "High" : r < 0.7 && a.score > 68 ? "Elevated" : "Low";
};

// Lakeshore State's tracked roster carries about 87% of the cap; scale the
// generated shares to that, then derive portal risk from share vs. market.
{
  const lsu = ATHLETES.filter((a) => a.schoolId === "lsu");
  // Shares mostly track value, with football weighted up and some noise.
  for (const a of lsu) a.revShare = marketValue(a) * between(0.55, 1.35) * (a.sport === "Football" ? 1.5 : a.sport.includes("basketball") ? 1.1 : 0.7);
  const sum = lsu.reduce((s, a) => s + a.revShare, 0);
  for (const a of lsu) a.revShare = Math.round((a.revShare / sum) * REV_SHARE_CAP * 0.87 / 5000) * 5000;
  ATHLETES[0].revShare = Math.max(ATHLETES[0].revShare, marketValue(ATHLETES[0]) * 0.85);
  for (const a of lsu) a.portalRisk = riskFor(a.revShare, a);
}

export const athleteById = (id: string) => ATHLETES.find((a) => a.id === id);
export const schoolById = (id: string) => SCHOOLS.find((s) => s.id === id)!;

/* ---------------- Brands, campaigns, deals ---------------- */

export type Brand = { id: string; name: string; category: string; hq: string };
export const BRANDS: Brand[] = [
  { id: "northline", name: "Northline Hydration", category: "Hydration", hq: "Chicago, IL" },
  { id: "kestrel", name: "Kestrel Athletic", category: "Apparel", hq: "Portland, OR" },
  { id: "summit", name: "Summit Auto Group", category: "Regional auto", hq: "Columbus, OH" },
  { id: "halo", name: "Halo Bank", category: "Fintech", hq: "Charlotte, NC" },
  { id: "fernway", name: "Fernway Beauty", category: "Beauty", hq: "Los Angeles, CA" },
  { id: "bolt", name: "Bolt Burger", category: "QSR", hq: "Dallas, TX" },
];
export const brandById = (id: string) => BRANDS.find((b) => b.id === id)!;

export type DealStage = "Shortlist" | "Offer sent" | "Negotiating" | "Contracted" | "Live" | "Complete";
export const DEAL_STAGES: DealStage[] = ["Shortlist", "Offer sent", "Negotiating", "Contracted", "Live", "Complete"];
export type FileStatus = "Draft" | "Ready" | "In review" | "Cleared" | "Needs info";

export type Deal = {
  id: string;
  athleteId: string;
  brandId: string;
  campaignId?: string;
  title: string;
  deliverables: string[];
  amount: number;
  stage: DealStage;
  file: FileStatus;
  updated: string; // ISO date
};

export type Campaign = {
  id: string;
  brandId: string;
  name: string;
  objective: string;
  budget: number;
  start: string;
  end: string;
  audience: string;
  status: "Planning" | "Live" | "Complete";
  results?: { reach: number; engagement: number; clicks: number; lift: number };
};

export const CAMPAIGNS: Campaign[] = [
  { id: "c1", brandId: "northline", name: "Spring hydration launch", objective: "Launch Northline Zero in the Midwest", budget: 240000, start: "2026-09-15", end: "2026-11-30", audience: "18–24, Midwest, fitness and training", status: "Live", results: { reach: 3120000, engagement: 6.8, clicks: 48200, lift: 14 } },
  { id: "c2", brandId: "northline", name: "Back to campus", objective: "Drive trial on 12 campuses", budget: 120000, start: "2026-08-01", end: "2026-09-10", audience: "18–22, college towns", status: "Complete", results: { reach: 2210000, engagement: 7.4, clicks: 36900, lift: 11 } },
  { id: "c3", brandId: "northline", name: "March run", objective: "Tournament-season awareness", budget: 400000, start: "2027-03-01", end: "2027-04-10", audience: "18–34, national, basketball fans", status: "Planning" },
];

const DELIVERABLES = [["1 Instagram reel", "2 stories"], ["1 TikTok", "1 appearance"], ["2 Instagram posts", "Usage rights 90 days"], ["1 reel", "1 TikTok", "Signing session"], ["Story series (5)", "Link in bio"]];
const lsuIds = ATHLETES.filter((a) => a.schoolId === "lsu").map((a) => a.id);

function makeDeals(): Deal[] {
  const deals: Deal[] = [];
  const stagesFor: Record<string, DealStage[]> = {
    c1: ["Live", "Live", "Live", "Contracted", "Contracted", "Negotiating", "Offer sent"],
    c2: ["Complete", "Complete", "Complete", "Complete"],
    c3: ["Shortlist", "Shortlist", "Shortlist", "Offer sent", "Negotiating"],
  };
  let n = 1;
  const used = new Set<string>();
  for (const c of CAMPAIGNS) {
    for (const stage of stagesFor[c.id]) {
      let a = pick(ATHLETES);
      while (used.has(a.id + c.id)) a = pick(ATHLETES);
      if (n === 1) a = ATHLETES[0];
      used.add(a.id + c.id);
      const amount = round(between(a.fmv[0], a.fmv[1]), 500);
      deals.push({
        id: `d${n++}`,
        athleteId: a.id,
        brandId: c.brandId,
        campaignId: c.id,
        title: c.name,
        deliverables: pick(DELIVERABLES),
        amount,
        stage,
        file: stage === "Complete" || stage === "Live" ? "Cleared" : stage === "Contracted" ? pick(["Cleared", "In review"] as const) : stage === "Negotiating" ? "Ready" : "Draft",
        updated: `2026-${pick(["08", "09", "10"])}-${String(1 + Math.floor(rand() * 7)).padStart(2, "0")}`,
      });
    }
  }
  // Third-party deals involving Lakeshore State athletes (school view).
  for (let k = 0; k < 14; k++) {
    const a = athleteById(lsuIds[Math.floor(rand() * lsuIds.length)])!;
    const b = pick(BRANDS.slice(1));
    const amount = round(between(a.fmv[0] * 0.7, a.fmv[1] * (k === 3 ? 2.6 : 1.1)), 500);
    deals.push({
      id: `d${n++}`,
      athleteId: a.id,
      brandId: b.id,
      title: `${b.name} × ${a.name.split(" ")[1]}`,
      deliverables: pick(DELIVERABLES),
      amount,
      stage: pick(["Contracted", "Live", "Complete", "Negotiating"] as const),
      file: amount > a.fmv[1] * 1.4 ? "Needs info" : pick(["Cleared", "Cleared", "In review", "Ready"] as const),
      updated: `2026-${pick(["09", "10"])}-${String(1 + Math.floor(rand() * 7)).padStart(2, "0")}`,
    });
  }
  // Jordan's own pipeline.
  deals.push(
    { id: `d${n++}`, athleteId: "a000", brandId: "summit", title: "Summit Auto: game-day series", deliverables: ["3 Instagram reels", "1 dealership appearance"], amount: 24000, stage: "Contracted", file: "In review", updated: "2026-10-06" },
    { id: `d${n++}`, athleteId: "a000", brandId: "kestrel", title: "Kestrel Athletic: training capsule", deliverables: ["2 TikToks", "Usage rights 60 days"], amount: 19500, stage: "Complete", file: "Cleared", updated: "2026-09-02" }
  );
  return deals;
}
export const DEALS: Deal[] = makeDeals();

export type Opportunity = { id: string; brandId: string; title: string; ask: string; offer: number; fit: number; expires: string };
export const OPPORTUNITIES: Opportunity[] = [
  { id: "o1", brandId: "northline", title: "March run: tournament content", ask: "2 reels and 1 campus appearance in March", offer: 22000, fit: 96, expires: "Oct 18" },
  { id: "o2", brandId: "halo", title: "Halo Bank: first paycheck", ask: "Financial-literacy story series (5)", offer: 9500, fit: 88, expires: "Oct 21" },
  { id: "o3", brandId: "bolt", title: "Bolt Burger: Saturday combo", ask: "1 TikTok and in-store signing", offer: 7000, fit: 81, expires: "Oct 25" },
];

/* ---------------- People ---------------- */

export type Role = "Owner" | "Admin" | "Manager" | "Analyst" | "Viewer";
export const ROLES: { role: Role; desc: string }[] = [
  { role: "Owner", desc: "Billing, security and everything below" },
  { role: "Admin", desc: "Manage members, teams and integrations" },
  { role: "Manager", desc: "Create campaigns, send offers, approve deal files" },
  { role: "Analyst", desc: "Search, score and build shortlists" },
  { role: "Viewer", desc: "Read-only access to dashboards" },
];
export type Member = { id: string; name: string; email: string; role: Role; team: string; lastActive: string; pending?: boolean };

export type PersonaKey = "brand" | "school" | "athlete" | "admin";
export type Persona = {
  key: PersonaKey;
  org: string;
  orgKind: string;
  user: { name: string; title: string; email: string; initials: string };
  members: Member[];
  teams: string[];
};

export const PERSONAS: Record<PersonaKey, Persona> = {
  admin: {
    key: "admin",
    org: "ArcScore HQ",
    orgKind: "Admin",
    user: { name: "Sam Okoye", title: "Head of Operations", email: "sam@arcscore.ai", initials: "SO" },
    teams: ["Operations", "Data science", "Customer success", "Engineering"],
    members: [
      { id: "m1", name: "Sam Okoye", email: "sam@arcscore.ai", role: "Owner", team: "Operations", lastActive: "Now" },
      { id: "m2", name: "Lena Fischer", email: "lena@arcscore.ai", role: "Admin", team: "Data science", lastActive: "6m ago" },
      { id: "m3", name: "Ravi Menon", email: "ravi@arcscore.ai", role: "Manager", team: "Customer success", lastActive: "1h ago" },
      { id: "m4", name: "Chloe Martin", email: "chloe@arcscore.ai", role: "Analyst", team: "Data science", lastActive: "3h ago" },
      { id: "m5", name: "Tom Becker", email: "tom@arcscore.ai", role: "Admin", team: "Engineering", lastActive: "Yesterday" },
    ],
  },
  brand: {
    key: "brand",
    org: "Northline Hydration",
    orgKind: "Brand",
    user: { name: "Avery Chen", title: "Head of Partnerships", email: "avery@northline.demo", initials: "AC" },
    teams: ["Partnerships", "Brand", "Legal", "Analytics"],
    members: [
      { id: "m1", name: "Avery Chen", email: "avery@northline.demo", role: "Owner", team: "Partnerships", lastActive: "Now" },
      { id: "m2", name: "Daniel Okoro", email: "daniel@northline.demo", role: "Manager", team: "Partnerships", lastActive: "12m ago" },
      { id: "m3", name: "Priya Raman", email: "priya@northline.demo", role: "Analyst", team: "Analytics", lastActive: "1h ago" },
      { id: "m4", name: "Sofia Marin", email: "sofia@northline.demo", role: "Manager", team: "Brand", lastActive: "Yesterday" },
      { id: "m5", name: "Gabe Lindstrom", email: "gabe@northline.demo", role: "Admin", team: "Legal", lastActive: "3d ago" },
      { id: "m6", name: "Hannah Wu", email: "hannah@agency.demo", role: "Viewer", team: "Brand", lastActive: "1w ago" },
    ],
  },
  school: {
    key: "school",
    org: "Lakeshore State Athletics",
    orgKind: "School",
    user: { name: "Marcus Reid", title: "Deputy AD, Revenue", email: "mreid@lakeshore.demo", initials: "MR" },
    teams: ["Administration", "Football", "Basketball", "Olympic sports", "Compliance"],
    members: [
      { id: "m1", name: "Marcus Reid", email: "mreid@lakeshore.demo", role: "Owner", team: "Administration", lastActive: "Now" },
      { id: "m2", name: "Tasha Greene", email: "tgreene@lakeshore.demo", role: "Admin", team: "Compliance", lastActive: "4m ago" },
      { id: "m3", name: "Coach Ray Dunn", email: "rdunn@lakeshore.demo", role: "Manager", team: "Football", lastActive: "2h ago" },
      { id: "m4", name: "Kim Alvarez", email: "kalvarez@lakeshore.demo", role: "Manager", team: "Olympic sports", lastActive: "Yesterday" },
      { id: "m5", name: "Ben Ostrowski", email: "bostrowski@lakeshore.demo", role: "Analyst", team: "Football", lastActive: "Yesterday" },
      { id: "m6", name: "Lauren Mills", email: "lmills@lakeshore.demo", role: "Manager", team: "Basketball", lastActive: "2d ago" },
      { id: "m7", name: "Dev Patel", email: "dpatel@lakeshore.demo", role: "Viewer", team: "Administration", lastActive: "1w ago" },
    ],
  },
  athlete: {
    key: "athlete",
    org: "Jordan Ellis",
    orgKind: "Athlete",
    user: { name: "Jordan Ellis", title: "WR · Lakeshore State", email: "jordan@ellis.demo", initials: "JE" },
    teams: ["Me", "Representation"],
    members: [
      { id: "m1", name: "Jordan Ellis", email: "jordan@ellis.demo", role: "Owner", team: "Me", lastActive: "Now" },
      { id: "m2", name: "Renee Ellis", email: "renee@ellis.demo", role: "Viewer", team: "Me", lastActive: "2d ago" },
      { id: "m3", name: "Calvin Booker", email: "cbooker@agency.demo", role: "Manager", team: "Representation", lastActive: "5h ago" },
    ],
  },
};

export const ACTIVITY: Record<PersonaKey, { t: string; text: string }[]> = {
  admin: [
    { t: "10:14", text: "Score model v2.3 recomputed 84 athletes in 41 seconds." },
    { t: "9:50", text: "Lakeshore State added 2 seats (now 7)." },
    { t: "9:02", text: "TikTok ingestion recovered after a 14-minute rate-limit pause." },
    { t: "Yesterday", text: "Northline Hydration renewed Brand Pro for 12 months." },
    { t: "Mon", text: "Ridgeview University started a pilot." },
  ],
  brand: [
    { t: "9:41", text: "Jordan Ellis posted reel 2 of 3 for Spring hydration launch. 412K reach so far." },
    { t: "9:12", text: "Deal file for Maya Okafor cleared NIL Go." },
    { t: "Yesterday", text: "Daniel sent 3 offers for March run." },
    { t: "Yesterday", text: "Arc found 6 new matches for your Midwest brief." },
    { t: "Mon", text: "Back to campus closed at 11% sales lift in test markets." },
  ],
  school: [
    { t: "10:02", text: "3 athletes moved to Elevated portal risk after the bye-week rankings." },
    { t: "9:30", text: "Tasha approved 4 deal files for submission." },
    { t: "Yesterday", text: "NIL Go asked for more information on 1 deal over fair-market range." },
    { t: "Yesterday", text: "Olympic sports picked up $86K in brand deals outside the cap this week." },
    { t: "Mon", text: "Q2 revenue-share scenario saved by Marcus Reid." },
  ],
  athlete: [
    { t: "9:41", text: "Your ArcScore rose 2 points after Saturday's game." },
    { t: "8:15", text: "Northline Hydration sent you an offer." },
    { t: "Yesterday", text: "Summit Auto deal file is in NIL Go review." },
    { t: "Sun", text: "You completed 2 of 3 growth-plan actions this week." },
  ],
};

/* ---------------- Formatting ---------------- */

export const fmtMoney = (n: number, compact = true) =>
  compact
    ? n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2).replace(/\.0+$/, "")}M`
      : n >= 10000
        ? `$${Math.round(n / 1000)}K`
        : n >= 1000
        ? `$${Math.round(n / 100) / 10}K`.replace(".0K", "K")
        : `$${n}`
    : `$${n.toLocaleString("en-US")}`;
export const fmtCount = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M` : n >= 1000 ? `${Math.round(n / 1000)}K` : `${n}`;
export const fmtRange = ([lo, hi]: [number, number]) => `${fmtMoney(lo)}–${fmtMoney(hi)}`;

/* ---------------- ArcScore admin (internal console) ---------------- */

export type Client = {
  id: string;
  name: string;
  kind: "Brand" | "School" | "Collective" | "Agency";
  plan: string;
  seats: number;
  seatsUsed: number;
  mrr: number;
  health: "Healthy" | "Watch" | "At risk";
  renews: string;
  since: string;
  athletes: number;
  persona?: PersonaKey; // demo workspace you can open as this client
  usage: number[]; // weekly active seats, 12 weeks
};

const usage = (base: number, trend: number) => Array.from({ length: 12 }, (_, i) => Math.max(0, Math.round(base + trend * i + between(-1.2, 1.2))));

export const CLIENTS: Client[] = [
  { id: "cl1", name: "Lakeshore State Athletics", kind: "School", plan: "Athletic Department", seats: 10, seatsUsed: 7, mrr: 9500, health: "Healthy", renews: "Jul 2027", since: "Feb 2026", athletes: 412, persona: "school", usage: usage(4, 0.3) },
  { id: "cl2", name: "Northline Hydration", kind: "Brand", plan: "Brand Pro", seats: 10, seatsUsed: 6, mrr: 4200, health: "Healthy", renews: "Oct 2027", since: "Apr 2026", athletes: 0, persona: "brand", usage: usage(3, 0.25) },
  { id: "cl3", name: "Ridgeview University", kind: "School", plan: "Pilot", seats: 5, seatsUsed: 2, mrr: 0, health: "Watch", renews: "Dec 2026", since: "Oct 2026", athletes: 388, usage: usage(1, 0.08) },
  { id: "cl4", name: "Kestrel Athletic", kind: "Brand", plan: "Brand Pro", seats: 15, seatsUsed: 12, mrr: 6300, health: "Healthy", renews: "Mar 2027", since: "Jan 2026", athletes: 0, usage: usage(8, 0.2) },
  { id: "cl5", name: "Summit Auto Group", kind: "Brand", plan: "Brand Starter", seats: 3, seatsUsed: 1, mrr: 900, health: "At risk", renews: "Nov 2026", since: "May 2026", athletes: 0, usage: usage(2, -0.15) },
  { id: "cl6", name: "Harbor Collective", kind: "Collective", plan: "Collective", seats: 6, seatsUsed: 5, mrr: 2800, health: "Healthy", renews: "Aug 2027", since: "Mar 2026", athletes: 96, usage: usage(4, 0.05) },
  { id: "cl7", name: "Mesa Valley State", kind: "School", plan: "Athletic Department", seats: 8, seatsUsed: 3, mrr: 6500, health: "Watch", renews: "Jun 2027", since: "Jun 2026", athletes: 301, usage: usage(3, -0.05) },
  { id: "cl8", name: "Fieldhouse Sports Mgmt", kind: "Agency", plan: "API", seats: 4, seatsUsed: 4, mrr: 3500, health: "Healthy", renews: "Feb 2027", since: "Jul 2026", athletes: 58, usage: usage(3, 0.1) },
];

export type Source = { name: string; kind: string; status: "Healthy" | "Degraded" | "Paused"; lastSync: string; records: number; latency: string; errors: number; volume: number[] };
export const SOURCES: Source[] = [
  { name: "Instagram Graph", kind: "Social", status: "Healthy", lastSync: "2 min ago", records: 1_284_000, latency: "1.2s", errors: 0.1, volume: usage(80, 1.5) },
  { name: "TikTok", kind: "Social", status: "Degraded", lastSync: "14 min ago", records: 842_000, latency: "4.8s", errors: 2.4, volume: usage(70, 0.5) },
  { name: "YouTube Data", kind: "Social", status: "Healthy", lastSync: "6 min ago", records: 96_000, latency: "0.9s", errors: 0, volume: usage(20, 0.3) },
  { name: "X", kind: "Social", status: "Paused", lastSync: "3 h ago", records: 211_000, latency: "–", errors: 0, volume: usage(30, -1.5) },
  { name: "Box scores & stats", kind: "Performance", status: "Healthy", lastSync: "1 min ago", records: 3_920_000, latency: "0.4s", errors: 0, volume: usage(60, 2) },
  { name: "Recruiting & rankings", kind: "Performance", status: "Healthy", lastSync: "1 h ago", records: 58_000, latency: "2.0s", errors: 0.3, volume: usage(12, 0.2) },
  { name: "Media mentions", kind: "Momentum", status: "Healthy", lastSync: "9 min ago", records: 412_000, latency: "1.6s", errors: 0.2, volume: usage(40, 0.8) },
  { name: "Deal outcomes", kind: "Market", status: "Healthy", lastSync: "Nightly", records: 18_400, latency: "–", errors: 0, volume: usage(8, 0.4) },
];

export type AuditEvent = { at: string; actor: string; org: string; action: string; detail: string };
export const AUDIT: AuditEvent[] = [
  { at: "Oct 8, 10:14", actor: "Lena Fischer", org: "ArcScore HQ", action: "Model published", detail: "Score model v2.3: Momentum weight 15 → 16" },
  { at: "Oct 8, 9:50", actor: "Marcus Reid", org: "Lakeshore State Athletics", action: "Seats changed", detail: "5 → 7 seats" },
  { at: "Oct 8, 9:31", actor: "Tasha Greene", org: "Lakeshore State Athletics", action: "Deal file approved", detail: "4 files submitted to NIL Go" },
  { at: "Oct 8, 9:12", actor: "System", org: "Northline Hydration", action: "Deal file cleared", detail: "Maya Okafor × Northline, $9.5K" },
  { at: "Oct 7, 17:40", actor: "Avery Chen", org: "Northline Hydration", action: "Plan renewed", detail: "Brand Pro, 12 months" },
  { at: "Oct 7, 15:02", actor: "Ravi Menon", org: "ArcScore HQ", action: "Workspace opened as client", detail: "Support session for Summit Auto Group (read-only)" },
  { at: "Oct 7, 11:26", actor: "Daniel Okoro", org: "Northline Hydration", action: "Offers sent", detail: "3 offers for March run" },
  { at: "Oct 6, 16:18", actor: "Tom Becker", org: "ArcScore HQ", action: "Source paused", detail: "X ingestion paused pending API terms" },
  { at: "Oct 6, 10:03", actor: "Sam Okoye", org: "ArcScore HQ", action: "Client created", detail: "Ridgeview University (pilot, 5 seats)" },
];

/** Model weights (percent). Must sum to 100. */
export const DEFAULT_WEIGHTS: Record<FactorKey, number> = { reach: 22, resonance: 20, performance: 18, momentum: 16, fit: 14, integrity: 10 };
export const scoreWith = (a: Athlete, w: Record<FactorKey, number>) => {
  const total = Object.values(w).reduce((s, v) => s + v, 0) || 1;
  return Math.round((Object.keys(w) as FactorKey[]).reduce((s, k) => s + a.factors[k] * w[k], 0) / total);
};
