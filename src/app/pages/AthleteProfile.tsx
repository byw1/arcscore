import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { useDemo } from "@/demo/store";
import { ATHLETES, CAMPAIGNS, FACTOR_META, athleteById, brandById, schoolById, fmtCount, fmtMoney, fmtRange } from "@/demo/data";
import { Avatar, Button, Card, CardHeader, Input, Modal, Select, Status, Tag } from "@/components/ui/primitives";
import { ArcChart, Meter, RangeBar, ScoreArc } from "@/components/ui/charts";
import { fileTone } from "./Deals";

export function AthleteProfile() {
  const { id = "" } = useParams();
  const { state, dispatch } = useDemo();
  const a = athleteById(id);
  const [offer, setOffer] = useState(false);
  if (!a) return <p className="text-ink-3">Athlete not found. <Link to="/app/athletes" className="underline">Back to athletes</Link></p>;

  const school = schoolById(a.schoolId);
  const comps = ATHLETES.filter((x) => x.id !== a.id && x.sport === a.sport).sort((x, y) => Math.abs(x.score - a.score) - Math.abs(y.score - a.score)).slice(0, 3);
  const deals = state.deals.filter((d) => d.athleteId === a.id);
  const platforms = Object.entries(a.followers) as [string, number][];
  const maxP = Math.max(...platforms.map(([, v]) => v));
  const shortlisted = state.shortlist.includes(a.id);
  const isBrand = state.persona === "brand";

  return (
    <>
      <Link to={state.persona === "athlete" ? "/app" : "/app/athletes"} className="mb-5 inline-flex items-center gap-1 text-[13px] text-ink-3 hover:text-ink">
        <ChevronLeft size={15} /> {state.persona === "athlete" ? "My score" : "Athletes"}
      </Link>
      <header className="mb-7 flex flex-wrap items-center gap-4">
        <Avatar initials={a.initials} size={56} />
        <div className="flex-1">
          <h1 className="title text-[26px] tracking-[-0.035em]">{a.name}</h1>
          <p className="mt-0.5 text-[14px] text-ink-3">{a.sport} · {a.position} · {a.year} · {school.name} ({school.tier}) · From {a.hometown}</p>
        </div>
        {isBrand && (
          <div className="flex gap-2">
            <Button onClick={() => dispatch({ type: "toggleShortlist", athleteId: a.id })}>{shortlisted ? "Shortlisted" : "Add to shortlist"}</Button>
            <Button variant="primary" onClick={() => setOffer(true)} disabled={!a.available}>{a.available ? "Send offer" : "Unavailable"}</Button>
          </div>
        )}
      </header>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <Card className="flex flex-col items-center py-8">
          <ScoreArc score={a.score} arc={a.arc} size={220} />
          <div className="mt-8 w-full space-y-3.5 px-1">
            {FACTOR_META.map((f) => <Meter key={f.key} label={f.label} value={a.factors[f.key]} hint={f.hint} />)}
          </div>
        </Card>
        <div className="space-y-5">
          <Card>
            <CardHeader title="Arc" sub={`Score history and 10-week projection. Momentum ${a.factors.momentum}.`} />
            <ArcChart history={a.history} arc={a.arc} />
          </Card>
          <div className="grid gap-5 md:grid-cols-2">
            <Card>
              <CardHeader title="Fair-market value" sub="Per standard campaign, based on comparable deals" />
              <div className="num text-[26px] font-medium tracking-[-0.035em]">{fmtRange(a.fmv)}</div>
              <div className="mt-3"><RangeBar lo={a.fmv[0]} hi={a.fmv[1]} /></div>
              <div className="mt-4 text-[12px] text-ink-3">Closest comparables</div>
              <ul className="mt-2 space-y-2">
                {comps.map((c) => (
                  <li key={c.id}>
                    <Link to={`/app/athletes/${c.id}`} className="flex items-center justify-between text-[13px] hover:text-ink">
                      <span className="text-ink-2">{c.name} <span className="text-ink-4">· {schoolById(c.schoolId).short}</span></span>
                      <span className="num text-ink-3">{c.score} · {fmtRange(c.fmv)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <CardHeader title="Audience" sub={`${fmtCount(a.audience)} real followers · ${a.authenticity}% authentic · ${a.engagement}% engagement`} />
              <ul className="space-y-2.5">
                {platforms.map(([p, v]) => (
                  <li key={p} className="grid grid-cols-[72px_1fr_44px] items-center gap-3 text-[13px]">
                    <span className="capitalize text-ink-2">{p === "x" ? "X" : p === "tiktok" ? "TikTok" : p === "youtube" ? "YouTube" : "Instagram"}</span>
                    <span className="h-[5px] rounded-full bg-sunken"><span className="block h-full rounded-full bg-cobalt" style={{ width: `${(v / maxP) * 100}%` }} /></span>
                    <span className="num text-right text-ink-3">{fmtCount(v)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                {["13–17", "18–24", "25–34", "35+"].map((l, i) => (
                  <div key={l} className="rounded-[10px] bg-sunken/70 py-2">
                    <div className="num text-[15px] font-medium">{a.ageMix[i]}%</div>
                    <div className="text-[11px] text-ink-3">{l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">{a.topRegions.map((r) => <Tag key={r}>{r}</Tag>)}</div>
            </Card>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Card>
              <CardHeader title="Brand fit" sub="Audience overlap with each category's customers" />
              <div className="space-y-3">{a.affinity.map((f, i) => <Meter key={f.category} label={f.category} value={f.score} emphasis={i === 0} />)}</div>
            </Card>
            <Card>
              <CardHeader title="Deals" sub={deals.length ? `${deals.length} on file` : "None on file yet"} />
              <ul className="space-y-3">
                {deals.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 text-[13px]">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{brandById(d.brandId).name}</div>
                      <div className="truncate text-ink-3">{d.deliverables.join(", ")} · {fmtMoney(d.amount)}</div>
                    </div>
                    <Status tone={fileTone(d.file)}>{d.file}</Status>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-2 rounded-[10px] bg-good-soft/70 px-3 py-2 text-[12.5px] text-good">
                <ShieldCheck size={14} /> Integrity {a.factors.integrity}: brand-safety scan clear
              </div>
            </Card>
          </div>
        </div>
      </div>
      {isBrand && <OfferModal open={offer} onClose={() => setOffer(false)} athleteId={a.id} />}
    </>
  );
}

function OfferModal({ open, onClose, athleteId }: { open: boolean; onClose: () => void; athleteId: string }) {
  const { dispatch } = useDemo();
  const a = athleteById(athleteId)!;
  const options = CAMPAIGNS.filter((c) => c.status !== "Complete").map((c) => c.name);
  const [campaign, setCampaign] = useState(options[0]);
  const [amount, setAmount] = useState(String(Math.round((a.fmv[0] + a.fmv[1]) / 2 / 500) * 500));
  const [deliv, setDeliv] = useState("1 Instagram reel, 2 stories");
  const value = Number(amount) || 0;
  const inRange = value >= a.fmv[0] && value <= a.fmv[1] * 1.15;
  return (
    <Modal open={open} onClose={onClose} title={`Offer to ${a.name}`}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const c = CAMPAIGNS.find((x) => x.name === campaign)!;
          dispatch({
            type: "addDeal",
            deal: { id: `d${Date.now()}`, athleteId, brandId: "northline", campaignId: c.id, title: c.name, deliverables: deliv.split(",").map((s) => s.trim()).filter(Boolean), amount: value, stage: "Offer sent", file: inRange ? "Ready" : "Draft", updated: "2026-10-08" },
          });
          dispatch({ type: "toast", text: `Offer sent to ${a.name}` });
          onClose();
        }}
      >
        <label className="block text-[13px] text-ink-2">Campaign<Select label="Campaign" value={campaign} onChange={setCampaign} options={options} className="mt-1.5 w-full" /></label>
        <label className="block text-[13px] text-ink-2">Deliverables<Input className="mt-1.5" value={deliv} onChange={(e) => setDeliv(e.target.value)} /></label>
        <label className="block text-[13px] text-ink-2">
          Amount (USD)
          <Input className="num mt-1.5" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))} />
        </label>
        <div>
          <RangeBar lo={a.fmv[0]} hi={a.fmv[1]} value={value} />
          <p className={`mt-1 text-[12.5px] ${inRange ? "text-good" : "text-bad"}`}>
            {inRange ? `Within the fair-market range (${fmtRange(a.fmv)}). The deal file is ready for NIL Go.` : `Outside the fair-market range (${fmtRange(a.fmv)}). NIL Go may ask for justification.`}
          </p>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={!value}>Send offer</Button>
        </div>
      </form>
    </Modal>
  );
}
