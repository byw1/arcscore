import { useRef } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { RevealWords } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const ATHLETES = [
  ["AR", "Soccer"],
  ["JE", "Football"],
  ["MO", "Volleyball"],
  ["TN", "Gymnastics"],
  ["KD", "Basketball"],
] as const;
const BRANDS = ["Sportswear", "Hydration", "Regional auto", "Fintech app", "Beauty", "QSR"];

function Node({ children, className, nodeRef }: { children: React.ReactNode; className?: string; nodeRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={nodeRef} className={cn("relative z-10 grid place-items-center rounded-full border border-white/10 bg-ink-2 shadow-[0_0_30px_-10px_rgba(90,209,255,0.5)]", className)}>
      {children}
    </div>
  );
}

export function Placement() {
  const container = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const a = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const b = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <p className="eyebrow mb-6">05 · The placement engine</p>
            <h2 className="display text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold">
              <RevealWords text="Placements," /> <RevealWords gradient text="not cold DMs." delay={0.2} />
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-chalk/60">
              Every athlete and every brand brief go through the same model. ArcScore ranks each pair by audience overlap, category affinity, price against fair-market range and expected return, then sends the best matches to both sides.
            </p>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[["Fit", "Who they reach"], ["Value", "What it's worth"], ["Arc", "Where it's going"]].map(([k, v]) => (
                <div key={k} className="border-l border-lime/40 pl-3">
                  <dt className="display text-xl font-bold">{k}</dt>
                  <dd className="text-xs text-chalk/50">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div ref={container} className="relative mx-auto flex h-[440px] w-full max-w-2xl items-center justify-between px-2 sm:px-8">
            <div className="flex h-full flex-col justify-between py-4">
              {ATHLETES.map(([i, s], idx) => (
                <div key={i} className="flex items-center gap-2">
                  <Node nodeRef={a[idx]} className="h-11 w-11 text-xs font-bold">{i}</Node>
                  <span className="hidden font-mono text-[10px] uppercase text-chalk/40 sm:block">{s}</span>
                </div>
              ))}
            </div>
            <Node nodeRef={core} className="h-24 w-24 border-lime/40 bg-ink shadow-[0_0_80px_-10px_rgba(198,255,61,0.6)]">
              <div className="text-center">
                <svg viewBox="0 0 40 28" className="mx-auto h-6" aria-hidden><path d="M3 25 C 10 0, 28 0, 35 22" fill="none" stroke="#c6ff3d" strokeWidth="3.2" strokeLinecap="round" /><circle cx="35.5" cy="22.5" r="3.6" fill="#c6ff3d" /></svg>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-wider text-lime">Match</div>
              </div>
            </Node>
            <div className="flex h-full flex-col justify-between py-2">
              {BRANDS.map((name, idx) => (
                <div key={name} className="flex items-center justify-end gap-2">
                  <span className="hidden font-mono text-[10px] uppercase text-chalk/40 sm:block">{name}</span>
                  <Node nodeRef={b[idx]} className="h-10 w-10">
                    <span className="h-3 w-3 rounded-sm bg-gradient-to-br from-cyan to-lime" style={{ transform: `rotate(${idx * 15}deg)` }} />
                  </Node>
                </div>
              ))}
            </div>
            {a.map((r, i) => (
              <AnimatedBeam key={`a${i}`} containerRef={container} fromRef={r} toRef={core} curvature={(i - 2) * -18} duration={3 + i * 0.3} delay={i * 0.2} />
            ))}
            {b.map((r, i) => (
              <AnimatedBeam key={`b${i}`} containerRef={container} fromRef={core} toRef={r} curvature={(i - 2.5) * 18} duration={3 + i * 0.25} delay={0.6 + i * 0.2} color="#5ad1ff" colorTo="#c6ff3d" dim={i === 4} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
