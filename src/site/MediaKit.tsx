import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import { useDemo } from "@/demo/store";
import { FACTOR_META, athleteById, brandById, schoolById, fmtCount, fmtRange } from "@/demo/data";
import { Logo } from "@/components/ui/logo";
import { ArcChart, Meter, ScoreArc } from "@/components/ui/charts";

/** Public, shareable media kit: what a brand sees before it reaches out. */
export function MediaKit() {
  const { id = "" } = useParams();
  const { state } = useDemo();
  const a = athleteById(id);
  useEffect(() => {
    if (a) document.title = `${a.name} · ArcScore media kit`;
    return () => void (document.title = "ArcScore: What every athlete is worth");
  }, [a]);
  if (!a) return <div className="grid min-h-screen place-items-center text-ink-3">Media kit not found.</div>;

  const school = schoolById(a.schoolId);
  const partners = Array.from(new Set(state.deals.filter((d) => d.athleteId === a.id && ["Live", "Complete", "Contracted"].includes(d.stage)).map((d) => d.brandId)));
  const platforms = Object.entries(a.followers) as [string, number][];
  const label = (p: string) => (p === "x" ? "X" : p === "tiktok" ? "TikTok" : p === "youtube" ? "YouTube" : "Instagram");

  return (
    <div className="min-h-screen bg-paper">
      <header className="relative overflow-hidden bg-night text-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cobalt/30 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-signal/20 blur-[120px]" />
        <div className="relative mx-auto max-w-[1080px] px-5 pb-14 pt-6 md:px-8">
          <div className="flex items-center justify-between">
            <Link to="/"><Logo invert /></Link>
            <span className="rounded-full border border-white/15 px-3 py-1 text-[12px] text-white/60">Media kit</span>
          </div>
          <div className="mt-14 grid items-end gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-2 text-[13px] text-white/60"><BadgeCheck size={15} className="text-[#8ea0ff]" /> Verified by ArcScore</div>
              <h1 className="display mt-4 text-[clamp(2.8rem,7vw,5.6rem)]">{a.name}</h1>
              <p className="mt-4 text-[16px] text-white/70">{a.sport} · {a.position} · {school.name}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-[14px] text-white/50"><MapPin size={14} /> From {a.hometown}</p>
            </div>
            <div className="glass-dark rounded-[24px] px-8 pb-6 pt-7">
              <ScoreArc score={a.score} arc={a.arc} size={220} dark />
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
            {[
              [fmtCount(a.audience), "Real followers"],
              [`${a.engagement}%`, "Engagement rate"],
              [`${a.authenticity}%`, "Authentic audience"],
              [fmtRange(a.fmv), "Fair-market range"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="num text-[26px] font-medium tracking-[-0.035em]">{v}</div>
                <div className="text-[12.5px] text-white/50">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1080px] space-y-5 px-5 py-12 md:px-8">
        <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
          <section className="card p-6">
            <h2 className="title text-[15px]">Trajectory</h2>
            <p className="mt-0.5 text-[13px] text-ink-3">ArcScore over 26 weeks, with the 10-week projection</p>
            <div className="mt-4"><ArcChart history={a.history} arc={a.arc} /></div>
          </section>
          <section className="card p-6">
            <h2 className="title mb-4 text-[15px]">What drives the score</h2>
            <div className="space-y-3.5">{FACTOR_META.map((f) => <Meter key={f.key} label={f.label} value={a.factors[f.key]} />)}</div>
          </section>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <section className="card p-6">
            <h2 className="title mb-4 text-[15px]">Platforms</h2>
            <ul className="space-y-3">
              {platforms.map(([p, v]) => (
                <li key={p} className="flex items-center justify-between text-[13.5px]"><span className="text-ink-2">{label(p)}</span><span className="num font-medium">{fmtCount(v)}</span></li>
              ))}
            </ul>
          </section>
          <section className="card p-6">
            <h2 className="title mb-4 text-[15px]">Audience</h2>
            <div className="grid grid-cols-2 gap-2">
              {["13–17", "18–24", "25–34", "35+"].map((l, i) => (
                <div key={l} className="rounded-[12px] bg-sky/60 px-3 py-2.5">
                  <div className="num text-[17px] font-medium text-sky-ink">{a.ageMix[i]}%</div>
                  <div className="text-[11.5px] text-ink-3">aged {l}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12.5px] text-ink-3">Strongest in {a.topRegions.slice(0, 2).join(" and ")}</p>
          </section>
          <section className="card p-6">
            <h2 className="title mb-4 text-[15px]">Best-fit categories</h2>
            <div className="space-y-3">{a.affinity.slice(0, 4).map((f, i) => <Meter key={f.category} label={f.category} value={f.score} emphasis={i === 0} />)}</div>
          </section>
        </div>
        {partners.length > 0 && (
          <section className="card p-6">
            <h2 className="title mb-4 text-[15px]">Worked with</h2>
            <div className="flex flex-wrap gap-2">{partners.map((b) => <span key={b} className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-[13px]">{brandById(b).name}</span>)}</div>
          </section>
        )}
        <section className="relative overflow-hidden rounded-[22px] bg-night p-8 text-white md:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cobalt/30 blur-[90px]" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="title text-[24px] tracking-[-0.03em]">Work with {a.name.split(" ")[0]}</h2>
              <p className="mt-1 text-[14px] text-white/60">Offers are checked against the fair-market range and come with a deal file for NIL Go.</p>
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-night hover:bg-white/90">Send an offer <ArrowRight size={15} /></Link>
          </div>
        </section>
        <p className="pt-4 text-center text-[12px] text-ink-4">Concept demo. This athlete and the figures shown are fictional.</p>
      </main>
    </div>
  );
}
