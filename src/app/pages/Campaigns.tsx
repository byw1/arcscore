import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useDemo } from "@/demo/store";
import { CAMPAIGNS, DEAL_STAGES, athleteById, fmtCount, fmtMoney, type DealStage } from "@/demo/data";
import { Avatar, Card, PageHeader, Stat, Status } from "@/components/ui/primitives";
import { fileTone } from "./Deals";

const statusTone = (s: string) => (s === "Live" ? "good" : s === "Planning" ? "pending" : "neutral") as "good" | "pending" | "neutral";

export function Campaigns() {
  const { state } = useDemo();
  return (
    <>
      <PageHeader title="Campaigns" sub="Northline Hydration · 2026–27 season" />
      <div className="grid gap-4 md:grid-cols-3">
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
  const c = CAMPAIGNS.find((x) => x.id === id);
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
