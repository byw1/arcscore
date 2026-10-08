import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Radar, Sigma, Crosshair } from "lucide-react";
import { FadeUp, RevealWords } from "@/components/ui/reveal";

const STEPS = [
  {
    n: "01",
    phase: "Launch",
    icon: Radar,
    title: "Ingest every signal",
    body: "Athletes connect their socials in two minutes. We pull in stats, schedules, rankings, media coverage and audience data, then audit it: bots stripped, reach deduplicated, sentiment scored.",
  },
  {
    n: "02",
    phase: "Trajectory",
    icon: Sigma,
    title: "Score and project",
    body: "Our models benchmark each athlete against comparable athletes by sport, position, conference and market. Out come the ArcScore, the 12-month Arc, and a fair-market range with the comparable deals behind it.",
  },
  {
    n: "03",
    phase: "Score",
    icon: Crosshair,
    title: "Place, run, measure",
    body: "The placement engine ranks every athlete-brand pair by fit and expected return. Deals are drafted, prepared for NIL Go, run and measured. Results feed back into the score, so the model improves with every campaign.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const t = useTransform(scrollYProgress, [0, 1], [0, 1]);
  // Exact point on the quadratic Bézier M40,230 Q600,-150 1160,230.
  const cx = useTransform(t, (v) => (1 - v) ** 2 * 40 + 2 * (1 - v) * v * 600 + v * v * 1160);
  const cy = useTransform(t, (v) => (1 - v) ** 2 * 230 + 2 * (1 - v) * v * -150 + v * v * 230);

  return (
    <section id="how" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="eyebrow mb-6">03 · How it works</p>
        <h2 className="display max-w-4xl text-[clamp(2.2rem,5.5vw,4.8rem)] font-extrabold">
          <RevealWords text="Launch. Trajectory." /> <RevealWords gradient text="Score." delay={0.25} />
        </h2>

        <div ref={ref} className="relative mt-16">
          <svg viewBox="0 0 1200 260" className="hidden w-full lg:block" aria-hidden>
            <defs>
              <linearGradient id="howarc" x1="0" x2="1"><stop stopColor="#5ad1ff" /><stop offset="1" stopColor="#c6ff3d" /></linearGradient>
            </defs>
            <path d="M40 230 Q 600 -150 1160 230" stroke="white" strokeOpacity=".07" strokeWidth="2" fill="none" strokeDasharray="4 8" />
            <motion.path d="M40 230 Q 600 -150 1160 230" stroke="url(#howarc)" strokeWidth="3" fill="none" strokeLinecap="round" style={{ pathLength: draw }} />
            <motion.circle r="10" fill="#ff7a3d" style={{ cx, cy }} />
            <motion.circle r="22" fill="#ff7a3d" opacity=".2" style={{ cx, cy }} />
            {[40, 600, 1160].map((x, i) => (
              <g key={x}>
                <circle cx={x} cy={i === 1 ? 40 : 230} r="6" fill="#06070b" stroke="#c6ff3d" strokeWidth="2" />
              </g>
            ))}
          </svg>

          <div className="grid gap-6 lg:-mt-4 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <FadeUp key={s.n} delay={i * 0.12}>
                <div className="relative h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-2 p-7">
                  <div className="absolute -right-6 -top-10 display text-[9rem] font-black text-white/[0.03]">{s.n}</div>
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-lime/10 text-lime"><s.icon size={20} /></div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-chalk/50">{s.n} · {s.phase}</span>
                  </div>
                  <h3 className="display mt-6 text-2xl font-bold">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-chalk/60">{s.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
