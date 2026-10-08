import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ArrowRight, Building2, GraduationCap, Trophy } from "lucide-react";
import { RevealWords } from "@/components/ui/reveal";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { APP_URL } from "@/lib/content";
import { cn } from "@/lib/utils";

type Tab = {
  id: "brands" | "schools" | "athletes";
  label: string;
  icon: typeof Building2;
  headline: string;
  sub: string;
  points: [string, string][];
  cta: { label: string; href: string };
  visual: React.ReactNode;
};

function BrandVisual() {
  const rows = [
    ["A. Rivera", "Soccer · ACC", 96, "$8–12K"],
    ["J. Ellis", "WR · Big Ten", 94, "$18–26K"],
    ["M. Okafor", "Volleyball · SEC", 91, "$6–9K"],
    ["T. Nguyen", "Gymnastics · Big 12", 89, "$10–15K"],
  ] as const;
  return (
    <div className="rounded-3xl border border-white/10 bg-ink p-5">
      <div className="flex items-center justify-between">
        <span className="eyebrow">Campaign · Spring hydration launch</span>
        <span className="rounded-full bg-lime/15 px-2 py-0.5 font-mono text-[10px] text-lime">Sample</span>
      </div>
      <div className="mt-4 space-y-2">
        {rows.map(([n, m, fit, fmv], i) => (
          <motion.div key={n} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan/40 to-lime/40 text-xs font-bold">{n[0]}</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{n}</div>
              <div className="font-mono text-[10px] text-chalk/45">{m}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm text-lime">{fit}% fit</div>
              <div className="font-mono text-[10px] text-chalk/45">{fmv}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[["2.1M", "Real reach"], ["71%", "In-market audience"], ["3.4×", "Proj. ROI"]].map(([v, l]) => (
          <div key={l} className="rounded-xl bg-white/[0.03] p-2.5"><div className="display text-lg font-bold">{v}</div><div className="font-mono text-[9px] uppercase text-chalk/45">{l}</div></div>
        ))}
      </div>
    </div>
  );
}

function SchoolVisual() {
  const bars = [
    ["Football", 68, "#c6ff3d"],
    ["Men's basketball", 17, "#5ad1ff"],
    ["Women's basketball", 6, "#9b7bff"],
    ["Baseball", 4, "#ff7a3d"],
    ["Olympic sports", 5, "#eef0f5"],
  ] as const;
  return (
    <div className="rounded-3xl border border-white/10 bg-ink p-5">
      <div className="flex items-center justify-between">
        <span className="eyebrow">Roster value · Revenue-share plan</span>
        <span className="rounded-full bg-lime/15 px-2 py-0.5 font-mono text-[10px] text-lime">Sample</span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="display text-4xl font-extrabold">$20.5M</div>
          <div className="font-mono text-[10px] uppercase text-chalk/45">Cap · 96.8% allocated</div>
        </div>
        <div className="text-right">
          <div className="display text-xl font-bold text-lime">+$3.2M</div>
          <div className="font-mono text-[10px] uppercase text-chalk/45">Commercial NIL found outside the cap</div>
        </div>
      </div>
      <div className="mt-5 flex h-3 overflow-hidden rounded-full">
        {bars.map(([l, v, c], i) => (
          <motion.div key={l} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ delay: 0.1 * i, duration: 0.8 }} style={{ background: c }} />
        ))}
      </div>
      <ul className="mt-4 space-y-1.5">
        {bars.map(([l, v, c]) => (
          <li key={l} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-chalk/70"><span className="h-2 w-2 rounded-full" style={{ background: c }} />{l}</span>
            <span className="font-mono text-xs text-chalk/50">{v}%</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-2xl border border-ember/30 bg-ember/10 p-3 text-sm text-ember">
        3 athletes valued above their current share are at portal risk. Review the scenario before the window opens.
      </div>
    </div>
  );
}

function AthleteVisual() {
  const tasks = [
    ["Post 2 training reels this week", "+2.1 Resonance"],
    ["Link your TikTok to deduplicate reach", "+1.4 Reach"],
    ["Complete your brand-safety review", "+3.0 Integrity"],
  ];
  return (
    <div className="rounded-3xl border border-white/10 bg-ink p-5">
      <div className="flex items-center justify-between">
        <span className="eyebrow">Your arc · Growth plan</span>
        <span className="rounded-full bg-lime/15 px-2 py-0.5 font-mono text-[10px] text-lime">Free</span>
      </div>
      <div className="mt-4 flex items-center gap-5">
        <div className="relative h-28 w-28">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" stroke="white" strokeOpacity=".08" strokeWidth="8" fill="none" />
            <motion.circle cx="50" cy="50" r="42" stroke="#c6ff3d" strokeWidth="8" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 0.74 }} transition={{ duration: 1.4 }} />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div><div className="display text-3xl font-extrabold">74</div><div className="font-mono text-[9px] uppercase text-chalk/45">ArcScore</div></div>
          </div>
        </div>
        <div>
          <div className="font-mono text-xs text-lime">▲ Arc +9 projected</div>
          <div className="mt-1 text-sm text-chalk/65">3 brands want athletes like you. Your fair-market range is <span className="text-chalk">$3.5K–$5K</span> per campaign.</div>
        </div>
      </div>
      <ul className="mt-5 space-y-2">
        {tasks.map(([t, g], i) => (
          <motion.li key={t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 text-sm">
            <span className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full border border-white/20" />{t}</span>
            <span className="whitespace-nowrap font-mono text-[10px] text-lime">{g}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const TABS: Tab[] = [
  {
    id: "brands",
    label: "Brands",
    icon: Building2,
    headline: "Find athletes your customers already follow.",
    sub: "Upload your customer profile, or just describe it. ArcScore ranks every athlete by audience overlap, price and expected return, then runs the campaign for you.",
    points: [
      ["Fit over follower count", "Match on audience age, region and interests, not vanity metrics."],
      ["Spot underpriced athletes", "Rising arcs cost less today than they will next season."],
      ["Run multi-athlete programs", "Briefs, contracts, content approvals and payouts in one flow."],
      ["Prove ROI", "Verified reach, engagement and attributed sales from every activation."],
    ],
    cta: { label: "Book a brand demo", href: "#demo" },
    visual: <BrandVisual />,
  },
  {
    id: "schools",
    label: "Schools & collectives",
    icon: GraduationCap,
    headline: "Manage your roster like a portfolio.",
    sub: "Revenue sharing made every roster a payroll. ArcScore gives athletic directors and GMs an objective value for every athlete, and finds commercial NIL money outside the cap.",
    points: [
      ["Roster value map", "Value and trajectory for every athlete, in every sport."],
      ["Cap scenario modeling", "Test revenue-share allocations against value, retention risk and Title IX."],
      ["Portal & retention alerts", "Know which athletes are undervalued before another school does."],
      ["Commercial NIL engine", "Connect Olympic-sport and women's athletes with brand dollars outside the cap."],
    ],
    cta: { label: "Book a school demo", href: "#demo" },
    visual: <SchoolVisual />,
  },
  {
    id: "athletes",
    label: "Athletes",
    icon: Trophy,
    headline: "Know your worth. Grow your arc.",
    sub: "Get your ArcScore free. See exactly what drives it, get a weekly plan to raise it, and get matched with brands that already want athletes like you.",
    points: [
      ["Your free score", "Connect your socials and see your value in minutes."],
      ["A plan to grow it", "Specific weekly actions, each tied to the factor it moves."],
      ["Brands come to you", "Get matched by fit, not by who has the biggest agent."],
      ["Deal-ready paperwork", "A fair-market file that backs up your price with NIL Go."],
    ],
    cta: { label: "Get your free ArcScore", href: APP_URL },
    visual: <AthleteVisual />,
  },
];

export function Audiences() {
  const [tab, setTab] = useState<Tab["id"]>("brands");
  const current = TABS.find((t) => t.id === tab)!;

  // Nav links (#brands, #schools, #athletes) open the matching tab.
  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.slice(1);
      if (TABS.some((t) => t.id === id)) setTab(id as Tab["id"]);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <section id="audiences" className="relative scroll-mt-24 py-28 md:py-40">
      {/* Anchor targets for the nav; the hash listener above picks the tab. */}
      {TABS.map((t) => (
        <span key={t.id} id={t.id} className="absolute top-0" aria-hidden />
      ))}
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="eyebrow mb-6">04 · Who it's for</p>
        <h2 className="display max-w-4xl text-[clamp(2.2rem,5.5vw,4.8rem)] font-extrabold">
          <RevealWords text="One score." /> <span className="text-chalk/35"><RevealWords text="Three sides of the market." delay={0.2} /></span>
        </h2>

        <div role="tablist" aria-label="Audience" className="mt-12 inline-flex flex-wrap gap-1 rounded-full border border-white/10 bg-white/[0.02] p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => {
                setTab(t.id);
              }}
              className={cn("relative rounded-full px-5 py-2.5 text-sm font-medium transition", tab === t.id ? "text-ink" : "text-chalk/60 hover:text-chalk")}
            >
              {tab === t.id && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-lime" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
              <span className="relative z-10 flex items-center gap-2"><t.icon size={15} /> {t.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            role="tabpanel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="mt-10 grid items-start gap-10 lg:grid-cols-2"
          >
            <div>
              <h3 className="display text-[clamp(1.8rem,3.4vw,2.8rem)] font-bold">{current.headline}</h3>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-chalk/60">{current.sub}</p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {current.points.map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lime/15 text-lime"><Check size={12} strokeWidth={3} /></span>
                    <div>
                      <div className="font-semibold">{t}</div>
                      <div className="text-sm leading-relaxed text-chalk/55">{d}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <ShimmerButton href={current.cta.href}>{current.cta.label} <ArrowRight size={16} /></ShimmerButton>
              </div>
            </div>
            <div className="lg:pl-8">{current.visual}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
