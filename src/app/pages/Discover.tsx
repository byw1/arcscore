import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useDemo } from "@/demo/store";
import { ATHLETES, CATEGORIES, schoolById, fmtCount, fmtMoney, fmtRange } from "@/demo/data";
import { AGE_I, REGIONS, fitFor, type Age } from "@/demo/match";
import { Avatar, Button, Card, PageHeader, Segmented, Select } from "@/components/ui/primitives";
import { Spark } from "@/components/ui/charts";

export function Discover() {
  const { state, dispatch } = useDemo();
  const [category, setCategory] = useState<string>("Hydration");
  const [age, setAge] = useState<Age>("18–24");
  const [region, setRegion] = useState("Midwest");
  const [cap, setCap] = useState(15000);

  const results = useMemo(
    () =>
      ATHLETES.filter((a) => a.available)
        .map((a) => ({ a, fit: fitFor(a, age, region, category, cap) }))
        .sort((x, y) => y.fit - x.fit)
        .slice(0, 12),
    [age, region, category, cap]
  );
  const short = ATHLETES.filter((a) => state.shortlist.includes(a.id));

  return (
    <>
      <PageHeader title="Discover" sub="Describe who you want to reach. Arc ranks every athlete by fit and price." />
      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <div className="space-y-5 lg:sticky lg:top-8 lg:self-start">
          <Card>
            <div className="space-y-5">
              <label className="block text-[13px] text-ink-2">Category<Select label="Category" value={category} onChange={setCategory} options={[...CATEGORIES]} className="mt-1.5 w-full" /></label>
              <div className="text-[13px] text-ink-2">
                Core audience age
                <Segmented className="mt-1.5 flex w-full [&>button]:flex-1" value={age} onChange={setAge} options={(["13–17", "18–24", "25–34"] as Age[]).map((v) => ({ value: v, label: v }))} />
              </div>
              <label className="block text-[13px] text-ink-2">Region<Select label="Region" value={region} onChange={setRegion} options={REGIONS} className="mt-1.5 w-full" /></label>
              <label className="block text-[13px] text-ink-2">
                <span className="flex justify-between">Max per athlete <span className="num text-ink">{fmtMoney(cap)}</span></span>
                <input type="range" min={2000} max={40000} step={1000} value={cap} onChange={(e) => setCap(Number(e.target.value))} className="mt-2.5 w-full accent-[var(--color-ink)]" aria-label="Maximum spend per athlete" />
              </label>
            </div>
          </Card>
          <Card>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="title text-[15px]">Shortlist</span>
              <span className="num text-[12.5px] text-ink-3">{short.length}</span>
            </div>
            {short.length ? (
              <>
                <ul className="space-y-2">
                  {short.map((a) => (
                    <li key={a.id} className="flex items-center justify-between text-[13px]">
                      <Link to={`/app/athletes/${a.id}`} className="truncate hover:underline">{a.name}</Link>
                      <span className="num text-ink-3">{fmtRange(a.fmv)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 border-t border-line pt-3 text-[12.5px] text-ink-3">
                  Est. {fmtMoney(short.reduce((s, a) => s + (a.fmv[0] + a.fmv[1]) / 2, 0))} · {fmtCount(short.reduce((s, a) => s + a.audience, 0))} reach
                </div>
              </>
            ) : (
              <p className="text-[13px] text-ink-3">Save athletes here to build a campaign.</p>
            )}
          </Card>
        </div>
        <div className="space-y-2.5">
          {results.map(({ a, fit }, i) => {
            const saved = state.shortlist.includes(a.id);
            return (
              <Card key={a.id} className="flex flex-wrap items-center gap-4 !p-4">
                <span className="num w-5 text-[12px] text-ink-4">{i + 1}</span>
                <Avatar initials={a.initials} size={38} />
                <div className="min-w-[180px] flex-1">
                  <Link to={`/app/athletes/${a.id}`} className="text-[14px] font-medium hover:underline">{a.name}</Link>
                  <div className="text-[12.5px] text-ink-3">{a.sport} · {schoolById(a.schoolId).name} · {a.ageMix[AGE_I[age]]}% aged {age} · {a.topRegions[0]}</div>
                </div>
                <Spark data={a.history} className="hidden md:block" />
                <div className="w-28 whitespace-nowrap text-right">
                  <div className="num text-[13.5px]">{fmtRange(a.fmv)}</div>
                  <div className="text-[11.5px] text-ink-3">Score {a.score}</div>
                </div>
                <div className="w-16 text-right">
                  <div className="num text-[20px] font-medium tracking-[-0.03em]">{fit}%</div>
                  <div className="text-[11.5px] text-ink-3">fit</div>
                </div>
                <Button variant={saved ? "secondary" : "ghost"} size="sm" onClick={() => dispatch({ type: "toggleShortlist", athleteId: a.id })} aria-label={saved ? "Remove from shortlist" : "Add to shortlist"}>
                  {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
