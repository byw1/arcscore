import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Building2, GraduationCap, User, ShieldCheck, Radar, Sigma, Crosshair } from "lucide-react";
import { ATHLETES, FACTOR_META, fmtRange } from "@/demo/data";
import { Logo } from "@/components/ui/logo";
import { ArcChart, Meter, RangeBar, ScoreArc } from "@/components/ui/charts";
import { Avatar } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const ArcScene = lazy(() => import("@/components/three/ArcScene"));
const ease = [0.2, 0.7, 0.2, 1] as const;
const jordan = ATHLETES[0];

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => setR(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  return r;
}
function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const on = () => setM(window.innerWidth < 768);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return m;
}

function Nav() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    // Nav inverts whenever it sits over a section marked data-dark.
    const on = () => {
      const under = document.elementsFromPoint(window.innerWidth / 2, 40).find((e) => !e.closest("header"));
      setDark(!!under?.closest("[data-dark]"));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={cn("fixed inset-x-0 top-0 z-40 transition-colors duration-500", dark ? "bg-transparent" : "border-b border-line bg-paper/80 backdrop-blur-md")}>
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 md:px-8">
        <Link to="/" aria-label="ArcScore home"><Logo invert={dark} /></Link>
        <nav className={cn("hidden items-center gap-8 text-[13.5px] md:flex", dark ? "text-white/70" : "text-ink-2")}>
          <a href="#product" className={dark ? "hover:text-white" : "hover:text-ink"}>Product</a>
          <a href="#score" className={dark ? "hover:text-white" : "hover:text-ink"}>The score</a>
          <a href="#who" className={dark ? "hover:text-white" : "hover:text-ink"}>Who it's for</a>
          <a href="#compliance" className={dark ? "hover:text-white" : "hover:text-ink"}>Compliance</a>
        </nav>
        <div className="flex items-center gap-1.5">
          <Link to="/login" className={cn("rounded-full px-3.5 py-2 text-[13.5px]", dark ? "text-white/75 hover:text-white" : "text-ink-2 hover:text-ink")}>Sign in</Link>
          <Link to="/login" className={cn("rounded-full px-4 py-2 text-[13.5px] font-medium transition", dark ? "bg-white text-night hover:bg-white/90" : "bg-ink text-paper hover:bg-ink/85")}>Try the demo</Link>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero: scroll-driven flight in three beats ---------------- */

const BEATS = [
  { eyebrow: "The NIL valuation engine", title: <>What every athlete <span className="text-arc">is worth.</span></>, body: "ArcScore values college athletes and matches them with the brands that fit. One clear number for brands, schools and athletes." },
  { eyebrow: "Score", title: <>Where they are <span className="text-arc">today.</span></>, body: "Reach, resonance, performance, momentum, market fit and integrity, read every day and benchmarked against comparable athletes." },
  { eyebrow: "Arc", title: <>Where they're <span className="text-arc">going.</span></>, body: "A twelve-month projection of value, so brands buy the rise and schools keep the athletes who are about to break out." },
];

function Hero() {
  const wrap = useRef<HTMLElement>(null);
  const progress = useRef(0.02);
  const [beat, setBeat] = useState(0);
  const [near, setNear] = useState(true);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  useEffect(() => {
    const on = () => {
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      progress.current = 0.04 + p * 0.96;
      setBeat(p < 0.3 ? 0 : p < 0.66 ? 1 : 2);
      setNear(r.bottom > 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  useEffect(() => {
    if (reduced) progress.current = 1;
  }, [reduced]);

  const b = BEATS[beat];
  return (
    <section ref={wrap} data-dark className="relative h-[300vh] bg-night text-white" aria-label="Introduction">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          <Suspense fallback={<div className="h-full w-full bg-night" />}>
            <ArcScene progress={progress} active={near && !reduced} lite={mobile} />
          </Suspense>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_40%,rgba(7,11,24,0.75)_0%,rgba(7,11,24,0.1)_55%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-night" />

        <div className="relative mx-auto flex h-full max-w-[1200px] flex-col justify-start px-5 pt-28 md:justify-center md:px-8 md:pt-0">
          <AnimatePresence mode="wait">
            <motion.div key={beat} initial={{ opacity: 0, y: 24, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(6px)" }} transition={{ duration: 0.6, ease }} className="max-w-[640px]">
              <p className="mb-5 inline-flex items-center gap-2 text-[13px] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_12px_2px_rgba(255,90,31,0.7)]" />
                {b.eyebrow}
              </p>
              <h1 className="display text-[clamp(2.9rem,7.2vw,6.4rem)]">{b.title}</h1>
              <p className="mt-6 max-w-[30rem] text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed text-white/70">{b.body}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14.5px] font-medium text-night shadow-[0_8px_30px_-6px_rgba(142,160,255,0.6)] transition hover:bg-white/90">
              Try the demo <ArrowRight size={16} />
            </Link>
            <a href="#product" className="rounded-full border border-white/15 px-5 py-3 text-[14.5px] text-white/80 backdrop-blur transition hover:border-white/30 hover:text-white">See the product</a>
          </div>
        </div>

        <AnimatePresence>
          {beat === 2 && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.6, ease }} className="glass-dark absolute right-[6%] top-[20%] hidden w-[260px] rounded-[20px] p-5 md:block">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-peach text-[13px] font-medium text-peach-ink">JE</span>
                <div>
                  <div className="text-[14px] font-medium">Jordan Ellis</div>
                  <div className="text-[12px] text-white/55">WR · Lakeshore State</div>
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="num text-[44px] font-medium leading-none tracking-[-0.05em]">87</div>
                  <div className="mt-1 text-[12px] text-white/55">ArcScore</div>
                </div>
                <div className="text-right">
                  <div className="num text-[20px] font-medium text-[#8ea0ff]">↑ 12</div>
                  <div className="text-[12px] text-white/55">12-month arc</div>
                </div>
              </div>
              <div className="mt-4 border-t border-white/10 pt-3 text-[12px] text-white/60">Fair-market range <span className="num text-white">$18K–$26K</span></div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2" aria-hidden>
          {BEATS.map((_, i) => (
            <span key={i} className={cn("h-1 rounded-full transition-all duration-500", i === beat ? "w-8 bg-white" : "w-3 bg-white/25")} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Product shot ---------------- */

function ProductShot() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 25%"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  return (
    <div ref={ref} className="relative mx-auto max-w-[1080px] px-4 [perspective:1600px]">
      <div className="pointer-events-none absolute -left-10 top-10 h-72 w-72 rounded-full bg-cobalt/25 blur-[100px]" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-signal/20 blur-[100px]" />
      <motion.div style={{ rotateX, scale, y, transformOrigin: "50% 0%" }} className="relative overflow-hidden rounded-[22px] border border-line bg-paper shadow-[0_2px_4px_rgb(17_17_16/0.04),0_50px_120px_-30px_rgb(7_11_24/0.45)]">
        <div className="flex items-center gap-1.5 border-b border-line bg-surface px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6159]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c941]" />
          <span className="ml-4 text-[12px] text-ink-4">app.arcscore.ai / athletes / jordan-ellis</span>
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-[280px_1fr] md:p-6">
          <div className="card flex flex-col items-center p-6">
            <div className="mb-5 flex w-full items-center gap-3">
              <Avatar initials="JE" size={36} />
              <div>
                <div className="text-[14px] font-medium">Jordan Ellis</div>
                <div className="text-[12px] text-ink-3">WR · Lakeshore State</div>
              </div>
            </div>
            <ScoreArc score={jordan.score} arc={jordan.arc} size={200} />
            <div className="mt-6 w-full space-y-3">
              {FACTOR_META.slice(0, 4).map((f) => <Meter key={f.key} label={f.label} value={jordan.factors[f.key]} />)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="card p-5">
              <div className="mb-3 text-[14px] font-medium">Arc</div>
              <ArcChart history={jordan.history} arc={jordan.arc} height={190} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card p-5">
                <div className="text-[13px] text-ink-3">Fair-market value</div>
                <div className="num mt-1 text-[22px] font-medium tracking-[-0.03em]">{fmtRange(jordan.fmv)}</div>
                <div className="mt-2"><RangeBar lo={jordan.fmv[0]} hi={jordan.fmv[1]} value={21000} /></div>
              </div>
              <div className="card p-5">
                <div className="text-[13px] text-ink-3">Best brand fit</div>
                <div className="mt-1 text-[22px] font-medium tracking-[-0.03em]">Hydration · <span className="text-cobalt">94%</span></div>
                <div className="mt-2 text-[12.5px] text-ink-3">71% of audience aged 18–24, Midwest</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-12% 0px" }} transition={{ duration: 0.9, ease, delay }}>
      {children}
    </motion.div>
  );
}

const STEPS = [
  { icon: Radar, n: "01", title: "Read", body: "Socials, stats, schedules and audience data, audited for bots and deduplicated." },
  { icon: Sigma, n: "02", title: "Score", body: "Six signals, benchmarked by sport, position, conference and market." },
  { icon: Crosshair, n: "03", title: "Place", body: "Every athlete–brand pair ranked by fit and price, with a deal file ready for NIL Go." },
];

const WHO = [
  { icon: Building2, who: "Brands", tint: "bg-sky text-sky-ink", wash: "from-sky", line: "Find the athletes your customers already follow.", detail: "Match on audience, not follower counts. Pay a fair price. See the sales lift.", stat: "+14%", statLabel: "sales lift in the demo campaign" },
  { icon: GraduationCap, who: "Schools", tint: "bg-peach text-peach-ink", wash: "from-peach", line: "Run the roster like a portfolio.", detail: "Value every athlete, model revenue share against the cap, and see portal risk early.", stat: "$20.5M", statLabel: "cap, allocated with evidence" },
  { icon: User, who: "Athletes", tint: "bg-mint text-mint-ink", wash: "from-mint", line: "Know what you're worth.", detail: "A free score, a weekly plan to raise it, and offers from brands that fit.", stat: "Free", statLabel: "for every athlete" },
];

const FACTOR_TINT = ["bg-sky text-sky-ink", "bg-peach text-peach-ink", "bg-lilac text-lilac-ink", "bg-signal-soft text-peach-ink", "bg-mint text-mint-ink", "bg-sand text-sand-ink"];

export function Landing() {
  return (
    <div className="bg-paper text-ink">
      <Nav />
      <main>
        <Hero />

        <section id="product" data-dark className="relative scroll-mt-10 overflow-hidden bg-gradient-to-b from-night via-[#1a2140] to-paper pb-28 pt-24 md:pb-40">
          <div className="mx-auto max-w-[1200px] px-5 text-center md:px-8">
            <Reveal>
              <p className="text-[13px] text-white/55">The product</p>
              <h2 className="display mx-auto mt-4 max-w-[16ch] text-[clamp(2.4rem,5vw,4.4rem)] text-white">Every athlete, explained in one screen.</h2>
            </Reveal>
          </div>
          <div className="mt-16"><ProductShot /></div>
        </section>

        <section id="score" className="scroll-mt-16 py-28 md:py-40">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="grid items-end gap-10 md:grid-cols-2">
              <Reveal>
                <p className="text-[13px] text-ink-3">The score</p>
                <h2 className="display mt-4 text-[clamp(2.4rem,5vw,4.4rem)]">Two numbers. <span className="text-ink-4">Nothing else to learn.</span></h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="max-w-md text-[17px] leading-relaxed text-ink-2">
                  <span className="font-medium text-ink">Score</span> is what an athlete is worth today. <span className="font-medium text-cobalt">Arc</span> is where that value is heading over the next year. Both are built from six signals, and both show their work.
                </p>
              </Reveal>
            </div>
            <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {FACTOR_META.map((f, i) => (
                <Reveal key={f.key} delay={i * 0.05}>
                  <div className="card flex h-full items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]">
                    <span className={cn("num grid h-10 w-10 shrink-0 place-items-center rounded-[12px] text-[15px] font-medium", FACTOR_TINT[i])}>{jordan.factors[f.key]}</span>
                    <div>
                      <div className="text-[16px] font-medium">{f.label}</div>
                      <div className="mt-1 text-[14px] leading-relaxed text-ink-3">{f.hint}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-20 grid gap-10 border-t border-line pt-14 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.08}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white"><s.icon size={16} /></span>
                    <span className="num text-[13px] text-ink-3">{s.n}</span>
                  </div>
                  <h3 className="title mt-5 text-[22px]">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{s.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="who" className="scroll-mt-16 bg-surface py-28 md:py-40">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <Reveal><h2 className="display max-w-[16ch] text-[clamp(2.4rem,5vw,4.4rem)]">One score. Three sides of the deal.</h2></Reveal>
            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {WHO.map((w, i) => (
                <Reveal key={w.who} delay={i * 0.08}>
                  <div className={cn("flex h-full flex-col rounded-[22px] border border-line bg-gradient-to-b via-paper to-paper p-7 transition hover:-translate-y-1 hover:shadow-[var(--shadow-float)]", w.wash)}>
                    <span className={cn("grid h-11 w-11 place-items-center rounded-[13px] bg-white/70 shadow-[var(--shadow-card)]", w.tint.split(" ")[1])}><w.icon size={19} strokeWidth={1.8} /></span>
                    <p className="mt-6 text-[13px] text-ink-3">{w.who}</p>
                    <h3 className="title mt-2 text-[23px] leading-tight tracking-[-0.03em]">{w.line}</h3>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-2">{w.detail}</p>
                    <div className="mt-8 border-t border-line pt-5">
                      <div className="num text-[28px] font-medium tracking-[-0.04em]">{w.stat}</div>
                      <div className="text-[12.5px] text-ink-3">{w.statLabel}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="compliance" className="scroll-mt-16 py-28 md:py-40">
          <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-5 md:grid-cols-2 md:px-8">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-[12.5px] font-medium text-mint-ink"><ShieldCheck size={13} /> Built for NIL Go</span>
              <h2 className="display mt-6 text-[clamp(2.2rem,4.6vw,4rem)]">Every deal over $600 now has to prove it's fair.</h2>
              <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-2">
                ArcScore checks each offer against a fair-market range built from comparable athletes, and packages the evidence NIL Go asks for before you submit.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="card p-7">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-ink-3">Deal file · Northline × Jordan Ellis</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2 py-0.5 text-[12px] font-medium text-mint-ink"><ShieldCheck size={12} /> Ready</span>
                </div>
                <div className="num mt-4 text-[34px] font-medium tracking-[-0.04em]">$21,000</div>
                <div className="mt-3"><RangeBar lo={18000} hi={26000} value={21000} max={34000} /></div>
                <div className="flex justify-between text-[12px] text-ink-3"><span>Range $18K–$26K</span><span>Within range</span></div>
                <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-[14px]">
                  {["Payer not associated with the school", "Valid business purpose", "Pay within range for comparable athletes"].map((t) => (
                    <li key={t} className="flex items-center gap-2.5"><span className="grid h-5 w-5 place-items-center rounded-full bg-mint text-mint-ink"><ShieldCheck size={11} /></span>{t}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <ClosingScene />
      </main>
      <footer className="bg-night text-white/50">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 border-t border-white/10 px-5 py-8 text-[12.5px] md:px-8">
          <Logo invert />
          <span>Concept demo prepared for ArcScore. Athletes, schools and brands shown are fictional.</span>
        </div>
      </footer>
    </div>
  );
}

function ClosingScene() {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} data-dark className="relative h-[86vh] min-h-[560px] overflow-hidden bg-night text-white">
      <div className="absolute inset-0">
        {near && (
          <Suspense fallback={null}>
            <ArcScene idle active={!reduced} lite={mobile} />
          </Suspense>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(7,11,24,0.7),transparent_75%)]" />
      <div className="relative flex h-full flex-col items-center justify-center px-5 text-center">
        <h2 className="display max-w-[14ch] text-[clamp(2.6rem,6vw,5.4rem)]">Every athlete has an <span className="text-arc">arc.</span></h2>
        <Link to="/login" className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14.5px] font-medium text-night hover:bg-white/90">
          Try the demo <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
