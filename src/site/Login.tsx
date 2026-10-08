import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Building2, GraduationCap, User, ShieldHalf } from "lucide-react";
import { useDemo } from "@/demo/store";
import { PERSONAS, type PersonaKey } from "@/demo/data";
import { Logo } from "@/components/ui/logo";
import { Button, Input } from "@/components/ui/primitives";
import { ScoreArc } from "@/components/ui/charts";
import { canAfford3D, loadArcScene } from "@/lib/prefetch";

const ArcScene = lazy(loadArcScene);

const CHOICES: { key: PersonaKey; icon: typeof User; blurb: string }[] = [
  { key: "brand", icon: Building2, blurb: "Find athletes, run campaigns, measure lift" },
  { key: "school", icon: GraduationCap, blurb: "Roster value, revenue share, compliance" },
  { key: "athlete", icon: User, blurb: "Your score, offers and growth plan" },
  { key: "admin", icon: ShieldHalf, blurb: "Internal console: clients, score model, data" },
];

export function Login() {
  const { dispatch } = useDemo();
  const nav = useNavigate();
  const [busy, setBusy] = useState<PersonaKey | null>(null);
  const [wide, setWide] = useState(false);
  useEffect(() => setWide(window.innerWidth >= 1024 && canAfford3D()), []);
  const enter = (k: PersonaKey) => {
    setBusy(k);
    setTimeout(() => {
      dispatch({ type: "login", persona: k });
      nav("/app");
    }, 450);
  };
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 md:px-14">
        <Link to="/"><Logo /></Link>
        <div className="mx-auto flex w-full max-w-[380px] flex-1 flex-col justify-center py-12">
          <h1 className="title text-[28px] tracking-[-0.035em]">Sign in</h1>
          <p className="mt-1.5 text-[14px] text-ink-3">The demo account is filled in for you.</p>
          <form
            className="mt-8 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              enter("brand");
            }}
          >
            <label className="block text-[13px] text-ink-2">Email<Input className="mt-1.5" type="email" defaultValue="demo@arcscore.ai" autoComplete="username" /></label>
            <label className="block text-[13px] text-ink-2">Password<Input className="mt-1.5" type="password" defaultValue="demo-password" autoComplete="current-password" /></label>
            <Button type="submit" variant="primary" className="mt-2 h-10 w-full">{busy === "brand" ? "Signing in…" : "Sign in"}</Button>
          </form>
          <div className="my-8 flex items-center gap-3 text-[12px] text-ink-4"><span className="h-px flex-1 bg-line" />or open a demo workspace<span className="h-px flex-1 bg-line" /></div>
          <div className="space-y-2">
            {CHOICES.map((c) => (
              <button key={c.key} onClick={() => enter(c.key)} className="focus-ring group flex w-full items-center gap-3 rounded-[12px] border border-line bg-surface p-3 text-left shadow-[var(--shadow-card)] transition hover:border-line-strong">
                <span className={`grid h-9 w-9 place-items-center rounded-[9px] ${c.key === "brand" ? "bg-sky text-sky-ink" : c.key === "school" ? "bg-peach text-peach-ink" : c.key === "athlete" ? "bg-mint text-mint-ink" : "bg-lilac text-lilac-ink"}`}><c.icon size={17} strokeWidth={1.8} /></span>
                <span className="flex-1">
                  <span className="block text-[13.5px] font-medium">{PERSONAS[c.key].org} <span className="font-normal text-ink-3">· {PERSONAS[c.key].orgKind}</span></span>
                  <span className="block text-[12.5px] text-ink-3">{c.blurb}</span>
                </span>
                <ArrowRight size={15} className="text-ink-4 transition group-hover:translate-x-0.5 group-hover:text-ink" />
              </button>
            ))}
          </div>
        </div>
        <p className="text-[12px] text-ink-4">Demo environment. All athletes, brands and schools are fictional.</p>
      </div>
      <div className="relative hidden overflow-hidden bg-night lg:block">
        {wide && (
          <Suspense fallback={null}>
            <ArcScene idle active />
          </Suspense>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_100%,rgba(7,11,24,0.85),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <div className="glass-dark mx-auto w-fit rounded-[24px] px-10 pb-7 pt-8">
            <ScoreArc score={87} arc={12} size={260} dark />
          </div>
          <p className="mx-auto mt-8 max-w-sm text-center text-[15px] leading-relaxed text-white/60">
            Score is where an athlete is.
            <br />
            <span className="text-white">Arc is where they're going.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
