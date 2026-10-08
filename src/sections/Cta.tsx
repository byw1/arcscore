import { lazy, Suspense, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useIsMobile, useNearViewport, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const LaunchScene = lazy(() => import("@/components/three/LaunchScene"));

const AUDIENCES = [
  ["brand", "I'm a brand"],
  ["school", "School / collective"],
  ["athlete", "I'm an athlete"],
  ["investor", "Investor"],
] as const;

type Status = { state: "idle" } | { state: "sending" } | { state: "done" } | { state: "error"; message: string };

export function Cta() {
  const [ref, near] = useNearViewport<HTMLElement>();
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number][0]>("brand");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, audience, source: "landing" }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong. Please try again.");
      setStatus({ state: "done" });
    } catch (err) {
      setStatus({ state: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  const input = "w-full rounded-2xl border border-white/10 bg-ink/70 px-4 py-3.5 text-sm text-chalk placeholder:text-chalk/35 outline-none transition focus:border-lime/60 focus:ring-2 focus:ring-lime/20";

  return (
    <section ref={ref} id="demo" className="relative isolate scroll-mt-16 overflow-hidden py-28 md:py-40">
      <div className="absolute inset-0 -z-10 opacity-90">
        <Suspense fallback={null}>
          <LaunchScene active={near && !reduced} lite={mobile} />
        </Suspense>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(6,7,11,0.55),#06070b_75%)]" />

      <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
        <p className="eyebrow mb-6">Take the shot</p>
        <h2 className="display text-[clamp(2.6rem,7vw,6rem)] font-extrabold">
          Find your <span className="text-gradient">arc.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-chalk/65">
          Brands and schools: book a 30-minute walkthrough with your own roster or category. Athletes: get your score free.
        </p>

        <div className="mx-auto mt-10 max-w-xl rounded-[28px] border border-white/10 bg-ink-2/80 p-5 text-left shadow-2xl shadow-black/60 backdrop-blur-xl md:p-7">
          {status.state === "done" ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="text-lime" size={44} />
              <p className="display mt-4 text-2xl font-bold">You're on the board.</p>
              <p className="mt-2 text-chalk/60">We'll be in touch within one business day.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="I am">
                {AUDIENCES.map(([v, l]) => (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={audience === v}
                    key={v}
                    onClick={() => setAudience(v)}
                    className={cn(
                      "rounded-xl border px-2 py-2.5 text-xs font-medium transition",
                      audience === v ? "border-lime bg-lime/10 text-lime" : "border-white/10 text-chalk/60 hover:border-white/25"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="sr-only" htmlFor="name">Name</label>
                <input id="name" name="name" placeholder="Full name" autoComplete="name" className={input} />
                <label className="sr-only" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required placeholder="Work or school email" autoComplete="email" className={input} />
              </div>
              <label className="sr-only" htmlFor="org">Organization</label>
              <input
                id="org"
                name="org"
                placeholder={audience === "athlete" ? "School and sport" : audience === "school" ? "School or collective" : audience === "investor" ? "Firm" : "Company"}
                className={input}
              />
              {/* honeypot */}
              <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <button
                type="submit"
                disabled={status.state === "sending"}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-lime px-6 py-4 font-semibold text-ink transition hover:bg-[#d4ff6b] disabled:opacity-60"
              >
                {status.state === "sending" ? <Loader2 className="animate-spin" size={18} /> : <>{audience === "athlete" ? "Get my ArcScore" : "Book a demo"} <ArrowRight size={16} /></>}
              </button>
              {status.state === "error" && <p className="text-center text-sm text-ember" role="alert">{status.message}</p>}
              <p className="text-center text-xs text-chalk/35">We never sell athlete data. You can delete your data at any time.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
