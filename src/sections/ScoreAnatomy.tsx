import { lazy, Suspense, useState } from "react";
import { motion } from "framer-motion";
import { FACTORS } from "@/lib/content";
import { useNearViewport, usePrefersReducedMotion } from "@/lib/hooks";
import { RevealWords } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { cn } from "@/lib/utils";

const ScoreCore = lazy(() => import("@/components/three/ScoreCore"));

function Sparkline() {
  const pts = [42, 44, 43, 48, 52, 51, 57, 61, 60, 66, 71, 74, 79, 81, 87];
  const proj = [87, 90, 93, 96, 99];
  const w = 260, h = 70, max = 100, n = pts.length + proj.length - 1;
  const xy = (v: number, i: number) => `${(i / n) * w},${h - (v / max) * h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-16 w-full" aria-hidden>
      <defs>
        <linearGradient id="spark" x1="0" x2="1"><stop stopColor="#5ad1ff" /><stop offset="1" stopColor="#c6ff3d" /></linearGradient>
        <linearGradient id="sparkfill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#c6ff3d" stopOpacity=".25" /><stop offset="1" stopColor="#c6ff3d" stopOpacity="0" /></linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts.map(xy).join(" ")} ${((pts.length - 1) / n) * w},${h}`} fill="url(#sparkfill)" />
      <polyline points={pts.map(xy).join(" ")} fill="none" stroke="url(#spark)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={proj.map((v, i) => xy(v, i + pts.length - 1)).join(" ")} fill="none" stroke="#c6ff3d" strokeWidth="2" strokeDasharray="3 4" opacity=".7" />
      <circle cx={((pts.length - 1) / n) * w} cy={h - (87 / max) * h} r="3.5" fill="#c6ff3d" />
    </svg>
  );
}

function AthleteCard() {
  return (
    <TiltCard className="w-full max-w-sm">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-ink-3 via-ink-2 to-ink p-6 shadow-[0_40px_120px_-30px_rgba(198,255,61,0.35)]">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-lime/20 blur-3xl" />
        <div className="flex items-start justify-between" style={{ transform: "translateZ(40px)" }}>
          <div>
            <p className="eyebrow !text-[9px]">Sample profile</p>
            <p className="display mt-1 text-2xl font-bold">Jordan Ellis</p>
            <p className="text-sm text-chalk/55">Wide receiver · Junior · Big Ten</p>
          </div>
          <div className="rounded-2xl border border-lime/30 bg-lime/10 px-3 py-2 text-center">
            <div className="display text-3xl font-extrabold leading-none text-lime">87</div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-wider text-lime/80">ArcScore</div>
          </div>
        </div>
        <div className="mt-5" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-chalk/45">
            <span>12-month arc</span>
            <span className="text-lime">Projected +12</span>
          </div>
          <Sparkline />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2" style={{ transform: "translateZ(20px)" }}>
          {[
            ["412K", "Real reach"],
            ["7.9%", "Engagement"],
            ["$22K", "FMV midpoint"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5">
              <div className="display text-lg font-bold">{v}</div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-chalk/45">{l}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5" style={{ transform: "translateZ(15px)" }}>
          {["Outdoor & fitness 94", "Energy drinks 89", "Regional auto 85"].map((t) => (
            <span key={t} className="rounded-full border border-cyan/25 bg-cyan/10 px-2.5 py-1 font-mono text-[10px] text-cyan">{t}</span>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}

export function ScoreAnatomy() {
  const [ref, near] = useNearViewport<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const active = FACTORS.find((f) => f.key === hovered);

  return (
    <section id="score" className="relative overflow-hidden py-28 md:py-40">
      <div className="hairline-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <p className="eyebrow mb-6">02 · The ArcScore</p>
        <div className="grid items-end gap-10 lg:grid-cols-2">
          <h2 className="display text-[clamp(2.2rem,5.5vw,4.8rem)] font-extrabold">
            <RevealWords text="Two numbers." />
            <br />
            <span className="text-chalk/35"><RevealWords text="Score is where you are." delay={0.2} /></span>
            <br />
            <RevealWords gradient text="Arc is where you're going." delay={0.4} />
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-chalk/65">
            Other indexes count followers or track contract value. ArcScore models an athlete's commercial value from six signal families and projects its trajectory, so you buy the rise, not the peak. Every score explains itself: you can see which signals moved it and by how much.
          </p>
        </div>

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div ref={ref} className="relative aspect-square w-full max-w-[640px] justify-self-center">
            <div className="absolute inset-[18%] rounded-full bg-lime/10 blur-[80px]" />
            <Suspense fallback={null}>
              <ScoreCore factors={FACTORS} score={87} active={near && !reduced} hovered={hovered} onHover={setHovered} />
            </Suspense>
          </div>

          <div className="flex flex-col gap-8">
            <AthleteCard />
            <ul className="grid grid-cols-2 gap-2">
              {FACTORS.map((f) => (
                <li key={f.key}>
                  <button
                    onMouseEnter={() => setHovered(f.key)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(f.key)}
                    onBlur={() => setHovered(null)}
                    className={cn(
                      "w-full rounded-2xl border p-3.5 text-left transition",
                      hovered === f.key ? "border-white/25 bg-white/[0.06]" : "border-white/[0.07] bg-white/[0.02]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{f.label}</span>
                      <span className="font-mono text-xs" style={{ color: f.color }}>{f.value}</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                      <motion.div className="h-full rounded-full" style={{ background: f.color }} initial={{ width: 0 }} whileInView={{ width: `${f.value}%` }} viewport={{ once: true }} transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="min-h-[96px] rounded-2xl border border-white/[0.07] bg-ink-2 p-4">
              {active ? (
                <>
                  <p className="text-sm text-chalk/80">{active.desc}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-chalk/40">{active.signals.join(" · ")}</p>
                </>
              ) : (
                <p className="text-sm text-chalk/45">Hover a factor to see what goes into it. Each factor is benchmarked against comparable athletes by sport, position, conference and market.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
