import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ATHLETES, FACTOR_META, fmtRange } from "@/demo/data";
import { Logo } from "@/components/ui/logo";
import { ArcChart, Meter, RangeBar, ScoreArc } from "@/components/ui/charts";
import { Avatar } from "@/components/ui/primitives";

const ease = [0.2, 0.7, 0.2, 1] as const;
const jordan = ATHLETES[0];

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-transparent bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 md:px-8">
        <Link to="/" aria-label="ArcScore home"><Logo /></Link>
        <nav className="hidden items-center gap-8 text-[13.5px] text-ink-2 md:flex">
          <a href="#score" className="hover:text-ink">The score</a>
          <a href="#who" className="hover:text-ink">Who it's for</a>
          <a href="#compliance" className="hover:text-ink">Compliance</a>
        </nav>
        <div className="flex items-center gap-1.5">
          <Link to="/login" className="rounded-full px-3.5 py-2 text-[13.5px] text-ink-2 hover:text-ink">Sign in</Link>
          <Link to="/login" className="rounded-full bg-ink px-4 py-2 text-[13.5px] font-medium text-paper hover:bg-ink/85">Try the demo</Link>
        </div>
      </div>
    </header>
  );
}

/** The arc that runs through the hero. The ball travels it once and comes to rest. */
function HeroArc() {
  return (
    <svg viewBox="0 0 1200 300" className="pointer-events-none absolute inset-x-0 top-[52%] w-full" preserveAspectRatio="none" aria-hidden>
      <motion.path
        id="hero-arc"
        d="M-20 290 C 300 -40, 900 -40, 1220 290"
        fill="none"
        stroke="var(--color-line-strong)"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, ease, delay: 0.3 }}
      />
    </svg>
  );
}

function ProductShot() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 30%"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  return (
    <div ref={ref} className="mx-auto max-w-[1080px] px-4 [perspective:1600px]">
      <motion.div style={{ rotateX, scale, y, transformOrigin: "50% 0%" }} className="overflow-hidden rounded-[22px] border border-line bg-paper shadow-[0_2px_4px_rgb(17_17_16/0.04),0_40px_100px_-30px_rgb(17_17_16/0.35)]">
        <div className="flex items-center gap-1.5 border-b border-line bg-surface px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
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
                <div className="mt-1 text-[22px] font-medium tracking-[-0.03em]">Hydration · 94%</div>
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

const WHO = [
  { who: "Brands", line: "Find the athletes your customers already follow.", detail: "Match on audience, not follower counts. Pay a fair price. See the sales lift." },
  { who: "Schools", line: "Run the roster like a portfolio.", detail: "Value every athlete, model revenue share against the cap, and see portal risk early." },
  { who: "Athletes", line: "Know what you're worth.", detail: "A free score, a plan to raise it, and offers from brands that fit." },
];

export function Landing() {
  return (
    <div className="bg-paper text-ink">
      <Nav />
      <main>
        <section className="relative overflow-hidden pt-40 pb-24 md:pt-48">
          <HeroArc />
          <div className="relative mx-auto max-w-[1200px] px-5 text-center md:px-8">
            <motion.h1 className="display mx-auto max-w-[14ch] text-[clamp(3rem,8.2vw,7.4rem)]" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease }}>
              What every athlete is worth.
            </motion.h1>
            <motion.p className="mx-auto mt-7 max-w-[34rem] text-[clamp(1.05rem,1.6vw,1.25rem)] leading-relaxed text-ink-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.2 }}>
              ArcScore values college athletes and matches them with the brands that fit. One clear number for brands, schools and athletes.
            </motion.p>
            <motion.div className="mt-10 flex items-center justify-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.45 }}>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14.5px] font-medium text-paper hover:bg-ink/85">
                Try the demo <ArrowRight size={16} />
              </Link>
              <a href="#score" className="rounded-full px-5 py-3 text-[14.5px] text-ink-2 hover:text-ink">How it works</a>
            </motion.div>
          </div>
          <div className="relative mt-24">
            <ProductShot />
          </div>
        </section>

        <section id="score" className="scroll-mt-16 border-t border-line py-28 md:py-40">
          <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-5 md:grid-cols-2 md:px-8">
            <Reveal>
              <p className="text-[13px] text-ink-3">The score</p>
              <h2 className="display mt-4 text-[clamp(2.4rem,5vw,4.4rem)]">Two numbers. Nothing else to learn.</h2>
              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-2">
                <span className="text-ink">Score</span> is what an athlete is worth today. <span className="text-ink">Arc</span> is where that value is heading over the next year. Both are built from six signals and show their work.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="divide-y divide-line border-y border-line">
                {FACTOR_META.map((f) => (
                  <li key={f.key} className="flex items-baseline justify-between gap-6 py-4">
                    <span className="text-[16px] font-medium">{f.label}</span>
                    <span className="text-right text-[14px] text-ink-3">{f.hint}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section id="who" className="scroll-mt-16 bg-surface py-28 md:py-40">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <Reveal><h2 className="display max-w-[16ch] text-[clamp(2.4rem,5vw,4.4rem)]">One score. Three sides of the deal.</h2></Reveal>
            <div className="mt-20 grid gap-12 md:grid-cols-3 md:gap-10">
              {WHO.map((w, i) => (
                <Reveal key={w.who} delay={i * 0.08}>
                  <div className="border-t border-ink pt-6">
                    <p className="text-[13px] text-ink-3">{w.who}</p>
                    <h3 className="title mt-3 text-[24px] leading-tight tracking-[-0.03em]">{w.line}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{w.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="compliance" className="scroll-mt-16 py-28 md:py-40">
          <div className="mx-auto max-w-[880px] px-5 text-center md:px-8">
            <Reveal>
              <p className="text-[13px] text-ink-3">Compliance</p>
              <h2 className="display mt-4 text-[clamp(2.2rem,4.6vw,4rem)]">Every deal over $600 now has to prove it's fair.</h2>
              <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink-2">
                ArcScore puts each offer against a fair-market range built from comparable athletes, and packages the evidence NIL Go asks for before you submit.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mx-auto mt-14 max-w-xl text-left">
              <div className="flex justify-between text-[12.5px] text-ink-3"><span>$18K</span><span className="text-ink">Offer $21K · within range</span><span>$26K</span></div>
              <div className="mt-2"><RangeBar lo={18000} hi={26000} value={21000} max={34000} /></div>
            </Reveal>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-line py-32 md:py-44">
          <div className="relative mx-auto max-w-[1200px] px-5 text-center md:px-8">
            <Reveal>
              <h2 className="display mx-auto max-w-[14ch] text-[clamp(2.6rem,6vw,5.4rem)]">Every athlete has an arc.</h2>
              <Link to="/login" className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14.5px] font-medium text-paper hover:bg-ink/85">
                Try the demo <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-5 py-8 text-[12.5px] text-ink-3 md:px-8">
          <Logo />
          <span>Concept demo prepared for ArcScore. Athletes, schools and brands shown are fictional.</span>
        </div>
      </footer>
    </div>
  );
}
