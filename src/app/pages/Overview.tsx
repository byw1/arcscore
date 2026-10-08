import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useDemo } from "@/demo/store";
import { ATHLETES, CAMPAIGNS, ACTIVITY, FACTOR_META, OPPORTUNITIES, REV_SHARE_CAP, marketValue, riskFor, athleteById, brandById, fmtCount, fmtMoney, fmtRange } from "@/demo/data";
import { Avatar, Card, CardHeader, PageHeader, Stat, Status, Button } from "@/components/ui/primitives";
import { ArcChart, Meter, ScoreArc, ShareBar, Spark } from "@/components/ui/charts";
import { fileTone } from "./Deals";

function Activity() {
  const { state } = useDemo();
  return (
    <Card>
      <CardHeader title="Activity" />
      <ol className="space-y-3.5">
        {ACTIVITY[state.persona!].map((e, i) => (
          <li key={i} className="flex gap-3 text-[13.5px]">
            <span className="num w-[68px] shrink-0 text-[12px] text-ink-3">{e.t}</span>
            <span className="text-ink-2">{e.text}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function BrandOverview() {
  const { state, persona } = useDemo();
  const deals = state.deals.filter((d) => d.brandId === "northline");
  const live = CAMPAIGNS.find((c) => c.id === "c1")!;
  const committed = deals.filter((d) => ["Contracted", "Live", "Complete"].includes(d.stage)).reduce((s, d) => s + d.amount, 0);
  const rising = [...ATHLETES].filter((a) => a.available).sort((a, b) => b.arc - a.arc).slice(0, 5);
  const attention = deals.filter((d) => d.stage === "Negotiating" || d.stage === "Offer sent" || d.file === "In review").slice(0, 4);

  return (
    <>
      <PageHeader title={`Good morning, ${persona.user.name.split(" ")[0]}`} sub="Spring hydration launch is live and pacing ahead of plan." actions={<Link to="/app/discover"><Button variant="primary">Find athletes</Button></Link>} />
      <Card className="mb-5">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          <Stat label="Live reach" value={fmtCount(live.results!.reach)} delta={18} foot="Spring hydration launch" />
          <Stat label="Engagement" value={`${live.results!.engagement}%`} foot="vs. 3.1% paid social" />
          <Stat label="Sales lift" value={`+${live.results!.lift}%`} foot="Test vs. control markets" />
          <Stat label="Committed" value={fmtMoney(committed)} foot={`of ${fmtMoney(CAMPAIGNS.reduce((s, c) => s + c.budget, 0))} NIL budget`} />
        </div>
      </Card>
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader title="Rising athletes" sub="Biggest projected arcs, available now" action={<Link to="/app/discover" className="text-[13px] text-ink-3 hover:text-ink">See all</Link>} />
          <ul className="-mx-2">
            {rising.map((a) => (
              <li key={a.id}>
                <Link to={`/app/athletes/${a.id}`} className="flex items-center gap-3 rounded-[10px] px-2 py-2.5 hover:bg-sunken/70">
                  <Avatar initials={a.initials} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-medium">{a.name}</div>
                    <div className="truncate text-[12px] text-ink-3">{a.sport} · {fmtRange(a.fmv)}</div>
                  </div>
                  <Spark data={a.history} className="hidden sm:block" />
                  <div className="num w-14 text-right text-[14px] font-medium">{a.score}</div>
                  <div className="num w-10 text-right text-[12.5px] text-good">↑{a.arc}</div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader title="Needs you" sub={`${attention.length} items`} />
            <ul className="space-y-3">
              {attention.map((d) => {
                const a = athleteById(d.athleteId)!;
                return (
                  <li key={d.id} className="flex items-center gap-3">
                    <Avatar initials={a.initials} size={26} />
                    <div className="min-w-0 flex-1 text-[13px]">
                      <div className="truncate font-medium">{a.name}</div>
                      <div className="truncate text-ink-3">{d.title} · {fmtMoney(d.amount)}</div>
                    </div>
                    {d.file === "In review" ? <Status tone="pending">In review</Status> : <Status tone="warn">{d.stage}</Status>}
                  </li>
                );
              })}
            </ul>
          </Card>
          <Activity />
        </div>
      </div>
    </>
  );
}

function SchoolOverview() {
  const { state, persona } = useDemo();
  const roster = ATHLETES.filter((a) => a.schoolId === "lsu");
  const alloc = (id: string, base: number) => state.allocations[id] ?? base;
  const allocated = roster.reduce((s, a) => s + alloc(a.id, a.revShare), 0);
  const value = roster.reduce((s, a) => s + marketValue(a), 0);
  const risk = roster.map((a) => ({ a, r: riskFor(alloc(a.id, a.revShare), a) })).filter((x) => x.r !== "Low").sort((x, y) => (x.r === y.r ? y.a.score - x.a.score : x.r === "High" ? -1 : 1));
  const bySport = ["Football", "Men's basketball", "Women's basketball", "Volleyball"].map((s) => ({
    label: s,
    value: roster.filter((a) => a.sport === s).reduce((t, a) => t + alloc(a.id, a.revShare), 0),
  }));
  bySport.push({ label: "Olympic sports", value: roster.filter((a) => !bySport.some((b) => b.label === a.sport)).reduce((t, a) => t + alloc(a.id, a.revShare), 0) });
  const outside = state.deals.filter((d) => athleteById(d.athleteId)?.schoolId === "lsu" && d.brandId !== "northline").reduce((s, d) => s + d.amount, 0);
  const flagged = state.deals.filter((d) => athleteById(d.athleteId)?.schoolId === "lsu" && d.file === "Needs info");

  return (
    <>
      <PageHeader title={`Good morning, ${persona.user.name.split(" ")[0]}`} sub={`Lakeshore State · ${roster.length} athletes tracked in the demo roster`} actions={<Link to="/app/roster"><Button variant="primary">Open roster</Button></Link>} />
      <Card className="mb-5">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          <Stat label="Revenue share allocated" value={fmtMoney(allocated)} foot={`${Math.round((allocated / REV_SHARE_CAP) * 100)}% of the ${fmtMoney(REV_SHARE_CAP)} cap`} />
          <Stat label="Roster market value" value={fmtMoney(value)} delta={6} foot="What the open market would pay, per year" />
          <Stat label="Brand NIL outside the cap" value={fmtMoney(outside)} foot="Third-party deals this season" />
          <Stat label="Portal risk" value={risk.length} foot="Paid well under market value" />
        </div>
      </Card>
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader title="Where the cap goes" sub="Revenue share by sport" />
            <ShareBar parts={bySport} />
          </Card>
          <Card>
            <CardHeader title="Retention watchlist" sub="Market value well above their share" action={<Link to="/app/roster" className="text-[13px] text-ink-3 hover:text-ink">Model changes</Link>} />
            <ul className="-mx-2">
              {risk.slice(0, 5).map(({ a, r }) => (
                <li key={a.id}>
                  <Link to={`/app/athletes/${a.id}`} className="flex items-center gap-3 rounded-[10px] px-2 py-2.5 hover:bg-sunken/70">
                    <Avatar initials={a.initials} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] font-medium">{a.name}</div>
                      <div className="truncate text-[12px] text-ink-3">{a.sport} · share {fmtMoney(alloc(a.id, a.revShare))} · market {fmtMoney(marketValue(a))}</div>
                    </div>
                    <Status tone={r === "High" ? "bad" : "warn"}>{r}</Status>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader title="Compliance" sub="Deal files for NIL Go" />
            <div className="flex items-baseline gap-2">
              <span className="num text-[28px] font-medium tracking-[-0.035em]">{flagged.length}</span>
              <span className="text-[13px] text-ink-3">need more information</span>
            </div>
            {flagged.map((d) => (
              <div key={d.id} className="mt-3 flex items-center justify-between rounded-[10px] bg-bad-soft/60 px-3 py-2 text-[13px]">
                <span>{athleteById(d.athleteId)!.name} · {fmtMoney(d.amount)}</span>
                <Status tone={fileTone(d.file)}>{d.file}</Status>
              </div>
            ))}
            <Link to="/app/deals" className="mt-4 inline-flex items-center gap-1 text-[13px] text-ink-2 hover:text-ink">Review deal files <ChevronRight size={14} /></Link>
          </Card>
          <Activity />
        </div>
      </div>
    </>
  );
}

function AthleteOverview() {
  const { state } = useDemo();
  const me = ATHLETES[0];
  const plan = [
    { text: "Finish your brand-safety review", gain: "+3.0 Integrity", done: false },
    { text: "Post two training reels this week", gain: "+2.1 Resonance", done: true },
    { text: "Link your YouTube channel", gain: "+1.4 Reach", done: true },
  ];
  const open = OPPORTUNITIES.filter((o) => state.opportunities[o.id] === "open");
  const earned = state.deals.filter((d) => d.athleteId === me.id && ["Complete", "Live", "Contracted"].includes(d.stage)).reduce((s, d) => s + d.amount, 0);
  return (
    <>
      <PageHeader title="Hi, Jordan" sub="Your score rose 2 points after Saturday's game." />
      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Card className="flex flex-col items-center justify-center py-10">
          <ScoreArc score={me.score} size={250} arc={me.arc} />
          <p className="mt-6 max-w-xs text-center text-[13.5px] leading-relaxed text-ink-3">
            Top 4% of Power 4 wide receivers. Your fair-market range is <span className="text-ink">{fmtRange(me.fmv)}</span> per campaign.
          </p>
        </Card>
        <Card>
          <CardHeader title="Your arc" sub="Score over the last 26 weeks, and where it's heading" />
          <ArcChart history={me.history} arc={me.arc} />
        </Card>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader title="What makes your score" />
          <div className="space-y-3.5">
            {FACTOR_META.map((f) => <Meter key={f.key} label={f.label} value={me.factors[f.key]} hint={f.hint} />)}
          </div>
        </Card>
        <Card>
          <CardHeader title="This week's plan" sub="Each step moves a factor" />
          <ul className="space-y-2.5">
            {plan.map((p) => (
              <li key={p.text} className="flex items-start gap-3 rounded-[10px] border border-line p-3 text-[13.5px]">
                <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${p.done ? "border-ink bg-ink text-paper" : "border-line-strong"}`}>{p.done && "✓"}</span>
                <span className={p.done ? "flex-1 text-ink-3 line-through" : "flex-1"}>{p.text}</span>
                <span className="num whitespace-nowrap text-[12px] text-good">{p.gain}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Opportunities" sub={`${open.length} open · ${fmtMoney(earned)} earned this season`} />
          <ul className="space-y-3">
            {open.map((o) => (
              <li key={o.id}>
                <Link to="/app/opportunities" className="flex items-center gap-3 rounded-[10px] p-1 hover:bg-sunken/70">
                  <Avatar initials={brandById(o.brandId).name.split(" ").map((w) => w[0]).join("").slice(0, 2)} size={30} className="rounded-[8px]" />
                  <div className="min-w-0 flex-1 text-[13px]">
                    <div className="truncate font-medium">{brandById(o.brandId).name}</div>
                    <div className="truncate text-ink-3">{fmtMoney(o.offer)} · {o.fit}% fit</div>
                  </div>
                  <ArrowUpRight size={15} className="text-ink-3" />
                </Link>
              </li>
            ))}
            {!open.length && <li className="text-[13px] text-ink-3">You've answered every offer.</li>}
          </ul>
        </Card>
      </div>
    </>
  );
}

export function Overview() {
  const { state } = useDemo();
  if (state.persona === "school") return <SchoolOverview />;
  if (state.persona === "athlete") return <AthleteOverview />;
  return <BrandOverview />;
}
