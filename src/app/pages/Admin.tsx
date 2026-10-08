import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useDemo } from "@/demo/store";
import { ACTIVITY, ATHLETES, AUDIT, CLIENTS, DEFAULT_WEIGHTS, FACTOR_META, SOURCES, schoolById, scoreWith, fmtMoney, type Client, type FactorKey } from "@/demo/data";
import { Avatar, Button, Card, CardHeader, Input, PageHeader, Segmented, Select, Sheet, Stat, Status, type StatusTone } from "@/components/ui/primitives";
import { Spark } from "@/components/ui/charts";
import { cn } from "@/lib/utils";

const healthTone = (h: Client["health"]): StatusTone => (h === "Healthy" ? "good" : h === "Watch" ? "warn" : "bad");
const sourceTone = (s: string): StatusTone => (s === "Healthy" ? "good" : s === "Degraded" ? "warn" : "neutral");

/* ---------------- Overview ---------------- */

export function AdminOverview() {
  const { persona } = useDemo();
  const mrr = CLIENTS.reduce((s, c) => s + c.mrr, 0);
  const seats = CLIENTS.reduce((s, c) => s + c.seatsUsed, 0);
  const athletes = CLIENTS.reduce((s, c) => s + c.athletes, 0);
  const attention = CLIENTS.filter((c) => c.health !== "Healthy");
  const degraded = SOURCES.filter((s) => s.status !== "Healthy");
  const nav = useNavigate();
  return (
    <>
      <PageHeader title={`Good morning, ${persona.user.name.split(" ")[0]}`} sub="ArcScore HQ · internal console" actions={<Button variant="primary" onClick={() => nav("/app/clients")}>Open clients</Button>} />
      <Card className="mb-5">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          <Stat label="Monthly recurring revenue" value={fmtMoney(mrr)} delta={12} foot={`${fmtMoney(mrr * 12)} annualized`} />
          <Stat label="Clients" value={CLIENTS.length} foot={`${CLIENTS.filter((c) => c.kind === "School").length} schools · ${CLIENTS.filter((c) => c.kind === "Brand").length} brands`} />
          <Stat label="Active seats" value={seats} foot="Across all workspaces" />
          <Stat label="Athletes under contract" value={athletes.toLocaleString()} foot={`${ATHLETES.length} in the demo index`} />
        </div>
      </Card>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader title="Needs attention" sub="Accounts with falling usage or an upcoming renewal" />
          <ul className="-mx-2">
            {attention.map((c) => (
              <li key={c.id} className="flex items-center gap-3 rounded-[10px] px-2 py-2.5">
                <Avatar initials={c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")} className="rounded-[8px]" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-medium">{c.name}</div>
                  <div className="truncate text-[12px] text-ink-3">{c.plan} · {c.seatsUsed}/{c.seats} seats · renews {c.renews}</div>
                </div>
                <Spark data={c.usage} className="hidden sm:block" />
                <Status tone={healthTone(c.health)}>{c.health}</Status>
              </li>
            ))}
          </ul>
        </Card>
        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader title="Data sources" sub={`${SOURCES.length - degraded.length} of ${SOURCES.length} healthy`} action={<button onClick={() => nav("/app/sources")} className="text-[13px] text-ink-3 hover:text-ink">View</button>} />
            <ul className="space-y-2">
              {degraded.map((s) => (
                <li key={s.name} className="flex items-center justify-between text-[13px]">
                  <span>{s.name}</span>
                  <Status tone={sourceTone(s.status)}>{s.status}</Status>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Activity" />
            <ol className="space-y-3">
              {ACTIVITY.admin.map((e, i) => (
                <li key={i} className="flex gap-3 text-[13px]"><span className="num w-[68px] shrink-0 text-[12px] text-ink-3">{e.t}</span><span className="text-ink-2">{e.text}</span></li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ---------------- Clients ---------------- */

export function Clients() {
  const { dispatch } = useDemo();
  const nav = useNavigate();
  const [kind, setKind] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Client | null>(null);
  const rows = CLIENTS.filter((c) => (kind === "All" || c.kind === kind) && c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Clients" sub="Every workspace on ArcScore" actions={<Button variant="primary" onClick={() => dispatch({ type: "toast", text: "New clients are created from HubSpot in production" })}>New client</Button>} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clients" className="max-w-xs" aria-label="Search clients" />
        <Select label="Type" value={kind} onChange={setKind} options={["All", "School", "Brand", "Collective", "Agency"]} />
      </div>
      <Card pad={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-[13.5px]">
            <thead className="border-b border-line text-[12px] text-ink-3">
              <tr>
                <th className="px-4 py-2.5 text-left font-normal">Client</th>
                <th className="px-3 py-2.5 text-left font-normal">Plan</th>
                <th className="px-3 py-2.5 text-right font-normal">Seats</th>
                <th className="px-3 py-2.5 text-right font-normal">MRR</th>
                <th className="px-3 py-2.5 text-right font-normal">12-week usage</th>
                <th className="px-3 py-2.5 text-left font-normal">Renews</th>
                <th className="px-4 py-2.5 text-right font-normal">Health</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} onClick={() => setOpen(c)} className="cursor-pointer border-b border-line/70 last:border-0 hover:bg-sunken/50">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")} className="rounded-[8px]" />
                      <span><span className="block font-medium">{c.name}</span><span className="block text-[12px] text-ink-3">{c.kind} · since {c.since}</span></span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-ink-2">{c.plan}</td>
                  <td className="num px-3 py-2.5 text-right text-ink-2">{c.seatsUsed}/{c.seats}</td>
                  <td className="num px-3 py-2.5 text-right">{c.mrr ? fmtMoney(c.mrr, false) : "–"}</td>
                  <td className="px-3 py-2.5"><Spark data={c.usage} className="ml-auto" /></td>
                  <td className="px-3 py-2.5 text-ink-2">{c.renews}</td>
                  <td className="px-4 py-2.5 text-right"><Status tone={healthTone(c.health)}>{c.health}</Status></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.name ?? "Client"}>
        {open && (
          <div className="space-y-6 p-5">
            <div className="flex items-center justify-between">
              <Status tone={healthTone(open.health)}>{open.health}</Status>
              <span className="text-[12px] text-ink-3">Client since {open.since}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Plan" value={<span className="text-[18px]">{open.plan}</span>} />
              <Stat label="MRR" value={open.mrr ? fmtMoney(open.mrr) : "Pilot"} />
              <Stat label="Seats" value={`${open.seatsUsed}/${open.seats}`} />
              <Stat label="Athletes" value={open.athletes || "–"} />
            </div>
            <div>
              <div className="mb-2 text-[13px] text-ink-3">Weekly active seats, last 12 weeks</div>
              <Spark data={open.usage} width={400} height={70} className="w-full" />
            </div>
            <div className="space-y-2 border-t border-line pt-5">
              {open.persona ? (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    dispatch({ type: "login", persona: open.persona! });
                    dispatch({ type: "toast", text: `Viewing as ${open.name}. Switch back from the workspace menu.` });
                    nav("/app");
                  }}
                >
                  Open workspace as client <ArrowRight size={15} />
                </Button>
              ) : (
                <p className="text-[13px] text-ink-3">This client's workspace isn't part of the demo.</p>
              )}
              <Button className="w-full" onClick={() => dispatch({ type: "toast", text: `Renewal reminder scheduled for ${open.name}` })}>Schedule renewal check-in</Button>
            </div>
          </div>
        )}
      </Sheet>
    </>
  );
}

/* ---------------- Score model ---------------- */

export function ScoreModel() {
  const { state, dispatch } = useDemo();
  const w = state.weights;
  const total = Object.values(w).reduce((s, v) => s + v, 0);
  const [scope, setScope] = useState<"all" | "lsu">("all");
  const pool = scope === "lsu" ? ATHLETES.filter((a) => a.schoolId === "lsu") : ATHLETES;

  const rows = useMemo(() => {
    const base = [...pool].map((a) => ({ a, before: scoreWith(a, DEFAULT_WEIGHTS), after: scoreWith(a, w) }));
    const rankBefore = new Map([...base].sort((x, y) => y.before - x.before).map((r, i) => [r.a.id, i + 1]));
    return [...base]
      .sort((x, y) => y.after - x.after)
      .map((r, i) => ({ ...r, rank: i + 1, move: (rankBefore.get(r.a.id) ?? 0) - (i + 1) }))
      .slice(0, 12);
  }, [pool, w]);
  const changed = (Object.keys(w) as FactorKey[]).some((k) => w[k] !== DEFAULT_WEIGHTS[k]);
  const moved = rows.filter((r) => r.after !== r.before).length;

  const set = (k: FactorKey, v: number) => dispatch({ type: "setWeights", weights: { ...w, [k]: v } });

  return (
    <>
      <PageHeader
        title="Score model"
        sub={`Live model v${state.modelVersion}. Adjust factor weights and see how rankings move before you publish.`}
        actions={
          <>
            <Button variant="ghost" disabled={!changed} onClick={() => dispatch({ type: "setWeights", weights: DEFAULT_WEIGHTS })}>Reset</Button>
            <Button variant="primary" disabled={!changed || total !== 100} onClick={() => dispatch({ type: "publishModel" })}>Publish</Button>
          </>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader title="Factor weights" sub={total === 100 ? "Weights add up to 100." : `Weights add up to ${total}. They must total 100 to publish.`} />
          <div className="space-y-5">
            {FACTOR_META.map((f) => (
              <label key={f.key} className="block">
                <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
                  <span className="text-ink-2">{f.label}</span>
                  <span className="num font-medium">{w[f.key]}%{w[f.key] !== DEFAULT_WEIGHTS[f.key] && <span className="ml-1.5 text-[11.5px] text-cobalt">({w[f.key] > DEFAULT_WEIGHTS[f.key] ? "+" : ""}{w[f.key] - DEFAULT_WEIGHTS[f.key]})</span>}</span>
                </div>
                <input type="range" min={0} max={40} value={w[f.key]} onChange={(e) => set(f.key, Number(e.target.value))} className="w-full accent-[var(--color-cobalt)]" aria-label={`${f.label} weight`} />
              </label>
            ))}
          </div>
          <div className={cn("mt-5 h-2 overflow-hidden rounded-full bg-sunken")}>
            <motion.div className={cn("h-full rounded-full", total === 100 ? "bg-cobalt" : "bg-warn")} animate={{ width: `${Math.min(100, total)}%` }} />
          </div>
        </Card>
        <Card pad={false} className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <div className="title text-[15px]">Ranking preview</div>
              <div className="text-[12.5px] text-ink-3">{changed ? `${moved} of the top 12 scores change with these weights` : "Showing the live model"}</div>
            </div>
            <Segmented value={scope} onChange={setScope} options={[{ value: "all", label: "All athletes" }, { value: "lsu", label: "Lakeshore State" }]} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-[13.5px]">
              <thead className="border-b border-line text-[12px] text-ink-3">
                <tr>
                  <th className="w-12 px-4 py-2.5 text-left font-normal">#</th>
                  <th className="px-3 py-2.5 text-left font-normal">Athlete</th>
                  <th className="px-3 py-2.5 text-right font-normal">Live</th>
                  <th className="px-3 py-2.5 text-right font-normal">Draft</th>
                  <th className="px-4 py-2.5 text-right font-normal">Rank move</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <motion.tr layout key={r.a.id} transition={{ type: "spring", stiffness: 500, damping: 40 }} className="border-b border-line/70 last:border-0">
                    <td className="num px-4 py-2.5 text-ink-3">{r.rank}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={r.a.initials} size={26} />
                        <span><span className="block font-medium">{r.a.name}</span><span className="block text-[12px] text-ink-3">{r.a.sport} · {schoolById(r.a.schoolId).short}</span></span>
                      </div>
                    </td>
                    <td className="num px-3 py-2.5 text-right text-ink-3">{r.before}</td>
                    <td className={cn("num px-3 py-2.5 text-right font-medium", r.after > r.before && "text-cobalt", r.after < r.before && "text-bad")}>{r.after}</td>
                    <td className="num px-4 py-2.5 text-right">
                      {r.move === 0 ? <span className="text-ink-4">–</span> : <span className={r.move > 0 ? "text-good" : "text-bad"}>{r.move > 0 ? "↑" : "↓"} {Math.abs(r.move)}</span>}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}

/* ---------------- Data sources ---------------- */

export function Sources() {
  const { dispatch } = useDemo();
  const total = SOURCES.reduce((s, x) => s + x.records, 0);
  return (
    <>
      <PageHeader title="Data sources" sub={`${(total / 1_000_000).toFixed(1)}M records ingested · scores refresh every 6 hours`} actions={<Button onClick={() => dispatch({ type: "toast", text: "Full re-sync queued" })}>Re-sync all</Button>} />
      <div className="grid gap-3 md:grid-cols-2">
        {SOURCES.map((s) => (
          <Card key={s.name} className="!p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[14px] font-medium">{s.name}</div>
                <div className="text-[12px] text-ink-3">{s.kind} · synced {s.lastSync}</div>
              </div>
              <Status tone={sourceTone(s.status)}>{s.status}</Status>
            </div>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div className="grid grid-cols-3 gap-5 text-[12px] text-ink-3">
                <div><div className="num text-[15px] font-medium text-ink">{s.records >= 1_000_000 ? `${(s.records / 1_000_000).toFixed(1)}M` : `${Math.round(s.records / 1000)}K`}</div>records</div>
                <div><div className="num text-[15px] font-medium text-ink">{s.latency}</div>p95 latency</div>
                <div><div className={cn("num text-[15px] font-medium", s.errors > 1 ? "text-warn" : "text-ink")}>{s.errors}%</div>errors</div>
              </div>
              <Spark data={s.volume} width={110} height={30} />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

/* ---------------- Audit log ---------------- */

export function AuditLog() {
  const [org, setOrg] = useState("All organizations");
  const orgs = ["All organizations", ...Array.from(new Set(AUDIT.map((e) => e.org)))];
  const rows = AUDIT.filter((e) => org === "All organizations" || e.org === org);
  return (
    <>
      <PageHeader title="Audit log" sub="Every change to clients, deals, seats and the score model" />
      <div className="mb-4"><Select label="Organization" value={org} onChange={setOrg} options={orgs} /></div>
      <Card pad={false} className="overflow-hidden">
        <ol>
          {rows.map((e, i) => (
            <li key={i} className="grid grid-cols-[110px_1fr] gap-4 border-b border-line/70 px-5 py-3.5 last:border-0 sm:grid-cols-[130px_200px_1fr]">
              <span className="num text-[12.5px] text-ink-3">{e.at}</span>
              <span className="text-[13px]"><span className="font-medium">{e.actor}</span><span className="block text-[12px] text-ink-3">{e.org}</span></span>
              <span className="col-span-2 text-[13px] sm:col-span-1"><span className="font-medium">{e.action}</span><span className="block text-ink-3">{e.detail}</span></span>
            </li>
          ))}
        </ol>
      </Card>
    </>
  );
}
