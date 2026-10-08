import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDemo } from "@/demo/store";
import { ATHLETES, REV_SHARE_CAP, fmtMoney, marketValue, riskFor } from "@/demo/data";
import { Avatar, Button, Card, PageHeader, Segmented, Status } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";


export function Roster() {
  const { state, dispatch } = useDemo();
  const [view, setView] = useState<"value" | "risk">("value");
  const roster = useMemo(() => ATHLETES.filter((a) => a.schoolId === "lsu"), []);
  const share = (id: string, base: number) => state.allocations[id] ?? base;
  const total = roster.reduce((s, a) => s + share(a.id, a.revShare), 0);
  const capLeft = REV_SHARE_CAP - total;
  const rows = [...roster]
    .map((a) => ({ a, s: share(a.id, a.revShare), v: marketValue(a), risk: riskFor(share(a.id, a.revShare), a) }))
    .sort((x, y) => (view === "risk" ? ["High", "Elevated", "Low"].indexOf(x.risk) - ["High", "Elevated", "Low"].indexOf(y.risk) || y.v - x.v : y.v - x.v));
  const atRisk = rows.filter((r) => r.risk !== "Low").length;

  return (
    <>
      <PageHeader
        title="Roster value"
        sub="Model revenue-share changes against market value and portal risk. Nothing is sent until you publish."
        actions={
          <>
            <Button variant="ghost" onClick={() => roster.forEach((a) => state.allocations[a.id] !== undefined && dispatch({ type: "allocate", athleteId: a.id, amount: a.revShare }))}>Revert</Button>
            <Button variant="primary" onClick={() => dispatch({ type: "toast", text: "Scenario saved and shared with Compliance" })}>Save scenario</Button>
          </>
        }
      />
      <Card className="mb-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-[13px] text-ink-3">Allocated</div>
            <div className="num mt-1 text-[34px] font-medium tracking-[-0.04em]">{fmtMoney(total)}<span className="text-[18px] text-ink-4"> / {fmtMoney(REV_SHARE_CAP)}</span></div>
          </div>
          <div className="flex gap-8 text-[13px]">
            <div><div className="text-ink-3">Room under cap</div><div className={cn("num mt-1 text-[18px] font-medium", capLeft < 0 && "text-bad")}>{fmtMoney(Math.abs(capLeft))}{capLeft < 0 && " over"}</div></div>
            <div><div className="text-ink-3">Portal risk</div><div className="num mt-1 text-[18px] font-medium">{atRisk} athletes</div></div>
          </div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-sunken">
          <div className={cn("h-full rounded-full transition-all duration-500", capLeft < 0 ? "bg-bad" : "bg-ink")} style={{ width: `${Math.min(100, (total / REV_SHARE_CAP) * 100)}%` }} />
        </div>
        <p className="mt-2 text-[12px] text-ink-4">This demo roster tracks {roster.length} athletes; the rest of the cap is held in team-level pools.</p>
      </Card>
      <div className="mb-3 flex items-center justify-between">
        <Segmented value={view} onChange={setView} options={[{ value: "value", label: "By market value" }, { value: "risk", label: "By risk" }]} />
      </div>
      <Card pad={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-[13.5px]">
            <thead className="border-b border-line text-[12px] text-ink-3">
              <tr>
                <th className="px-4 py-2.5 text-left font-normal">Athlete</th>
                <th className="px-3 py-2.5 text-right font-normal">Score</th>
                <th className="px-3 py-2.5 text-right font-normal">Market value / yr</th>
                <th className="w-[300px] px-3 py-2.5 text-left font-normal">Revenue share</th>
                <th className="px-4 py-2.5 text-right font-normal">Risk</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ a, s, v, risk }) => (
                <tr key={a.id} className="border-b border-line/70 last:border-0">
                  <td className="px-4 py-2.5">
                    <Link to={`/app/athletes/${a.id}`} className="flex items-center gap-3">
                      <Avatar initials={a.initials} />
                      <span><span className="block font-medium">{a.name}</span><span className="block text-[12px] text-ink-3">{a.sport} · {a.position}</span></span>
                    </Link>
                  </td>
                  <td className="num px-3 py-2.5 text-right">{a.score}</td>
                  <td className="num px-3 py-2.5 text-right text-ink-2">{fmtMoney(v)}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={Math.max(500_000, Math.round((v * 1.4) / 5000) * 5000)}
                        step={5000}
                        value={s}
                        onChange={(e) => dispatch({ type: "allocate", athleteId: a.id, amount: Number(e.target.value) })}
                        className="w-full accent-[var(--color-ink)]"
                        aria-label={`Revenue share for ${a.name}`}
                      />
                      <span className={cn("num w-16 text-right", state.allocations[a.id] !== undefined && state.allocations[a.id] !== a.revShare && "font-medium text-ink")}>{fmtMoney(s)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right"><Status tone={risk === "High" ? "bad" : risk === "Elevated" ? "warn" : "good"}>{risk}</Status></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
