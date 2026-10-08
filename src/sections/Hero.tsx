import { lazy, Suspense, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, ShieldCheck, Target } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useIsMobile, useNearViewport, usePrefersReducedMotion } from "@/lib/hooks";
import { APP_URL } from "@/lib/content";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

function HudCard({ className, delay, children }: { className: string; delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
      className={`absolute hidden rounded-2xl border border-white/10 bg-ink/60 p-3.5 shadow-2xl shadow-black/50 backdrop-blur-xl xl:block ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const [ref, near] = useNearViewport<HTMLElement>("0px");
  const progress = useRef(0);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();

  useEffect(() => {
    const on = () => {
      const h = window.innerHeight;
      progress.current = Math.min(1, Math.max(0, window.scrollY / h));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <section ref={ref} id="top" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16">
      <div className="absolute inset-0 -z-10">
        <Suspense fallback={null}>
          <HeroScene progress={progress} active={near && !reduced} lite={mobile} />
        </Suspense>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,#06070b_85%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-full bg-gradient-to-r from-ink/85 via-ink/40 to-transparent md:w-2/3" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-b from-transparent to-ink" />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#c6ff3d" />

      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-4 backdrop-blur">
          <span className="rounded-full bg-lime px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink">New</span>
          <span className="text-xs text-chalk/75">Fair-market value reports, ready for NIL Go</span>
        </motion.div>

        <h1 className="display max-w-5xl text-[clamp(3rem,9vw,8.5rem)] font-extrabold">
          <motion.span className="block" initial={{ opacity: 0, y: 40, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}>
            Every athlete
          </motion.span>
          <motion.span className="block" initial={{ opacity: 0, y: 40, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1, delay: 0.12, ease: [0.2, 0.7, 0.2, 1] }}>
            has an <span className="text-gradient">arc.</span>
          </motion.span>
        </h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.9 }} className="mt-7 max-w-xl text-lg leading-relaxed text-chalk/70 md:text-xl">
          ArcScore is the valuation and placement engine for college NIL. Our AI reads reach, audience quality, performance and momentum, and turns them into one explainable number: what an athlete is worth today, and where they're heading.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.9 }} className="mt-10 flex flex-wrap items-center gap-3">
          <ShimmerButton href="#demo">
            Book a demo <ArrowRight size={16} />
          </ShimmerButton>
          <ShimmerButton href={APP_URL} variant="ghost">
            Athletes: get your free score
          </ShimmerButton>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-14 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.16em] text-chalk/45">
          <span>For brands</span>
          <span className="hidden text-lime/60 sm:inline">/</span>
          <span>For schools &amp; collectives</span>
          <span className="hidden text-lime/60 sm:inline">/</span>
          <span>For athletes</span>
        </motion.div>
      </div>

      <HudCard className="right-[6%] top-[24%]" delay={1.1}>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-lime/15 text-lime"><TrendingUp size={18} /></div>
          <div>
            <div className="eyebrow !text-[9px]">ArcScore · sample</div>
            <div className="display text-2xl font-bold">87 <span className="font-mono text-xs font-medium text-lime">▲ +6 / 30d</span></div>
          </div>
        </div>
      </HudCard>
      <HudCard className="right-[14%] top-[52%]" delay={1.3}>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan/15 text-cyan"><Target size={18} /></div>
          <div>
            <div className="eyebrow !text-[9px]">Brand fit · Outdoor &amp; fitness</div>
            <div className="display text-2xl font-bold">94%</div>
          </div>
        </div>
      </HudCard>
      <HudCard className="right-[4%] top-[70%]" delay={1.5}>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-ember/15 text-ember"><ShieldCheck size={18} /></div>
          <div>
            <div className="eyebrow !text-[9px]">Fair-market range</div>
            <div className="display text-2xl font-bold">$18k–$26k</div>
          </div>
        </div>
      </HudCard>

      <a href="#problem" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-chalk/40 md:flex" aria-label="Scroll to learn more">
        <span className="eyebrow !text-[10px]">Follow the arc</span>
        <span className="h-10 w-px overflow-hidden bg-white/10">
          <motion.span className="block h-4 w-px bg-lime" animate={{ y: [-16, 40] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} />
        </span>
      </a>
    </section>
  );
}
