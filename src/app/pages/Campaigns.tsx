import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft, Plus } from "lucide-react";
import { useDemo } from "@/demo/store";
import { ATHLETES, CATEGORIES, DEAL_STAGES, athleteById, schoolById, fmtCount, fmtMoney, fmtRange, type DealStage } from "@/demo/data";
import { AGE_I, REGIONS, fitFor, type Age } from "@/demo/match";
import { Avatar, Button, Card, Input, Modal, PageHeader, Segmented, Select, Stat, Status } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { fileTone } from "./Deals";

const statusTone = (s: string) => (s === "Live" ? "good" : s === "Planning" ? "pending" : "neutral") as "good" | "pending" | "neutral";

export function Campaigns() {
  const { state } = useDemo();
  const CAMPAIGNS = state.campaigns;
  const [wizard, setWizard] = useState(false);
  return (
    <>
      <PageHeader title="Campaigns" sub="Northline Hydration · 2026–27 season" actions={<Button variant="primary" onClick={() => setWizard(true)}><Plus size={15} /> New campaign</Button>} />
      <NewCampaign open={wizard} onClose={() => setWizard(false)} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CAMPAIGNS.map((c) => {
          const deals = state.deals.filter((d) => d.campaignId === c.id);
          const spent = deals.filter((d) => ["Contracted", "Live", "Complete"].includes(d.stage)).reduce((s, d) => s + d.amount, 0);
          return (
            <Link key={c.id} to={`/app/campaigns/${c.id}`} className="card block p-5 transition hover:border-line-strong">
              <Status tone={statusTone(c.status)}>{c.status}</Status>
              <h2 className="title mt-4 text-[18px]">{c.name}</h2>
              <p className="mt-1 text-[13px] text-ink-3">{c.objective}</p>
              <div className="mt-6 flex -space-x-2">
                {deals.slice(0, 6).map((d) => <Avatar key={d.id} initials={athleteById(d.athleteId)!.initials} size={28} className="ring-2 ring-surface" />)}
              </div>
              <div className="mt-4 h-[4px] overflow-hidden rounded-full bg-sunken">
                <div className="h-full rounded-full bg-ink" style={{ width: `${Math.min(100, (spent / c.budget) * 100)}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-[12.5px] text-ink-3">
                <span className="num">{fmtMoney(spent)} committed</span>
                <span className="num">{fmtMoney(c.budget)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export function CampaignDetail() {
  const { id } = useParams();
  const { state, dispatch } = useDemo();
  const c = state.campaigns.find((x) => x.id === id);
  if (!c) return <p className="text-ink-3">Campaign not found.</p>;
  const deals = state.deals.filter((d) => d.campaignId === c.id);
  const stages = DEAL_STAGES;

  return (
    <>
      <Link to="/app/campaigns" className="mb-5 inline-flex items-center gap-1 text-[13px] text-ink-3 hover:text-ink"><ChevronLeft size={15} /> Campaigns</Link>
      <PageHeader title={c.name} sub={`${c.objective} · ${c.audience} · ${c.start} to ${c.end}`} actions={<Status tone={statusTone(c.status)}>{c.status}</Status>} />
      {c.results && (
        <Card className="mb-5">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat label="Reach" value={fmtCount(c.results.reach)} />
            <Stat label="Engagement" value={`${c.results.engagement}%`} />
            <Stat label="Clicks" value={fmtCount(c.results.clicks)} />
            <Stat label="Sales lift" value={`+${c.results.lift}%`} foot="Test vs. control markets" />
          </div>
        </Card>
      )}
      <div className="-mx-4 overflow-x-auto px-4 pb-2">
        <div className="grid min-w-[1120px] grid-cols-6 gap-3">
          {stages.map((s) => {
            const col = deals.filter((d) => d.stage === s);
            return (
              <div key={s} className="rounded-[14px] bg-sunken/70 p-2">
                <div className="flex items-baseline justify-between px-1.5 pb-2 pt-1 text-[12.5px]">
                  <span className="font-medium text-ink-2">{s}</span>
                  <span className="num text-ink-4">{col.length}</span>
                </div>
                <div className="space-y-2">
                  {col.map((d) => {
                    const a = athleteById(d.athleteId)!;
                    return (
                      <div key={d.id} className="card p-3">
                        <div className="flex items-center gap-2">
                          <Avatar initials={a.initials} size={22} />
                          <Link to={`/app/athletes/${a.id}`} className="truncate text-[13px] font-medium hover:underline">{a.name}</Link>
                        </div>
                        <div className="num mt-2 text-[13px]">{fmtMoney(d.amount)}</div>
                        <div className="mt-1 truncate text-[11.5px] text-ink-3">{d.deliverables.join(", ")}</div>
                        <div className="mt-2.5 flex items-center justify-between gap-1">
                          <Status tone={fileTone(d.file)} className="!text-[11px]">{d.file}</Status>
                          <select
                            aria-label={`Move ${a.name}`}
                            value={d.stage}
                            onChange={(e) => {
                              dispatch({ type: "moveDeal", id: d.id, stage: e.target.value as DealStage });
                              dispatch({ type: "toast", text: `${a.name} moved to ${e.target.value}` });
                            }}
                            className="max-w-[78px] rounded-md bg-transparent text-[11.5px] text-ink-3 hover:text-ink"
                          >
                            {stages.map((x) => <option key={x}>{x}</option>)}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                  {!col.length && <div className="rounded-[10px] border border-dashed border-line-strong px-2 py-5 text-center text-[11.5px] text-ink-4">Empty</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ---------------- New campaign wizard ---------------- */

const STEPS = ["Brief", "Audience", "Athletes"] as const;

function NewCampaign({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch } = useDemo();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Summer training series");
  const [objective, setObjective] = useState("Grow trial of Northline Zero with student athletes");
  const [budget, setBudget] = useState(150000);
  const [category, setCategory] = useState("Hydration");
  const [age, setAge] = useState<Age>("18–24");
  const [region, setRegion] = useState("Midwest");
  const [picked, setPicked] = useState<string[]>([]);

  const perAthlete = Math.round(budget / 6);
  const matches = useMemo(
    () =>
      ATHLETES.filter((a) => a.available)
        .map((a) => ({ a, fit: fitFor(a, age, region, category, perAthlete) }))
        .sort((x, y) => y.fit - x.fit)
        .slice(0, 8),
    [age, region, category, perAthlete]
  );
  const spend = picked.reduce((s, id) => s + Math.round(((athleteById(id)!.fmv[0] + athleteById(id)!.fmv[1]) / 2) / 500) * 500, 0);

  const close = () => {
    onClose();
    setTimeout(() => { setStep(0); setPicked([]); }, 200);
  };
  const create = () => {
    const id = `c${state.campaigns.length + 1}${Date.now() % 1000}`;
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    dispatch({
      type: "addCampaign",
      campaign: { id, brandId: "northline", name, objective, budget, start: fmt(new Date(today.getTime() + 14 * 864e5)), end: fmt(new Date(today.getTime() + 74 * 864e5)), audience: `${age}, ${region}, ${category.toLowerCase()}`, status: "Planning" },
    });
    picked.forEach((aid, i) => {
      const a = athleteById(aid)!;
      dispatch({ type: "addDeal", deal: { id: `d${Date.now()}${i}`, athleteId: aid, brandId: "northline", campaignId: id, title: name, deliverables: ["1 Instagram reel", "2 stories"], amount: Math.round(((a.fmv[0] + a.fmv[1]) / 2) / 500) * 500, stage: "Shortlist", file: "Draft", updated: fmt(today) } });
    });
    dispatch({ type: "toast", text: `${name} created with ${picked.length} athletes shortlisted` });
    close();
    nav(`/app/campaigns/${id}`);
  };

  return (
    <Modal open={open} onClose={close} title="New campaign">
      <ol className="mb-5 flex items-center gap-2 text-[12.5px]">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span className={cn("grid h-5 w-5 place-items-center rounded-full text-[11px]", i < step ? "bg-cobalt text-white" : i === step ? "bg-ink text-paper" : "bg-sunken text-ink-3")}>{i < step ? <Check size={11} /> : i + 1}</span>
            <span className={i === step ? "text-ink" : "text-ink-3"}>{s}</span>
            {i < STEPS.length - 1 && <span className="h-px w-5 bg-line-strong" />}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="space-y-4">
          <label className="block text-[13px] text-ink-2">Name<Input className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="block text-[13px] text-ink-2">Objective<Input className="mt-1.5" value={objective} onChange={(e) => setObjective(e.target.value)} /></label>
          <label className="block text-[13px] text-ink-2">
            <span className="flex justify-between">Budget <span className="num text-ink">{fmtMoney(budget)}</span></span>
            <input type="range" min={20000} max={500000} step={10000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="mt-2.5 w-full accent-[var(--color-cobalt)]" aria-label="Budget" />
          </label>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <label className="block text-[13px] text-ink-2">Category<Select label="Category" value={category} onChange={setCategory} options={[...CATEGORIES]} className="mt-1.5 w-full" /></label>
          <div className="text-[13px] text-ink-2">Core audience age<Segmented className="mt-1.5 flex w-full [&>button]:flex-1" value={age} onChange={setAge} options={(["13–17", "18–24", "25–34"] as Age[]).map((v) => ({ value: v, label: v }))} /></div>
          <label className="block text-[13px] text-ink-2">Region<Select label="Region" value={region} onChange={setRegion} options={REGIONS} className="mt-1.5 w-full" /></label>
          <p className="rounded-[10px] bg-cobalt-soft px-3 py-2.5 text-[12.5px] text-sky-ink">Arc will rank every available athlete against this audience, aiming for about {fmtMoney(perAthlete)} per athlete.</p>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="mb-3 text-[13px] text-ink-3">Arc's best matches for this brief. Pick who to shortlist.</p>
          <ul className="max-h-[300px] space-y-1.5 overflow-y-auto pr-1">
            {matches.map(({ a, fit }) => {
              const on = picked.includes(a.id);
              return (
                <li key={a.id}>
                  <button
                    onClick={() => setPicked((p) => (on ? p.filter((x) => x !== a.id) : [...p, a.id]))}
                    className={cn("flex w-full items-center gap-3 rounded-[10px] border p-2.5 text-left transition", on ? "border-cobalt bg-cobalt-soft" : "border-line hover:border-line-strong")}
                    aria-pressed={on}
                  >
                    <Avatar initials={a.initials} size={28} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium">{a.name}</span>
                      <span className="block truncate text-[11.5px] text-ink-3">{a.sport} · {schoolById(a.schoolId).short} · {a.ageMix[AGE_I[age]]}% aged {age} · {fmtRange(a.fmv)}</span>
                    </span>
                    <span className="num text-[14px] font-medium">{fit}%</span>
                    <span className={cn("grid h-5 w-5 place-items-center rounded-full border", on ? "border-cobalt bg-cobalt text-white" : "border-line-strong")}>{on && <Check size={11} />}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex justify-between text-[12.5px]">
            <span className="text-ink-3">{picked.length} selected</span>
            <span className={cn("num", spend > budget ? "text-bad" : "text-ink-2")}>Est. {fmtMoney(spend)} of {fmtMoney(budget)}</span>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={() => (step ? setStep(step - 1) : close())}>{step ? "Back" : "Cancel"}</Button>
        {step < 2 ? (
          <Button variant="primary" disabled={!name.trim()} onClick={() => setStep(step + 1)}>Continue</Button>
        ) : (
          <Button variant="primary" disabled={!picked.length} onClick={create}>Create campaign</Button>
        )}
      </div>
    </Modal>
  );
}
