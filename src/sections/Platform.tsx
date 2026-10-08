import { Network, ScanSearch, Workflow, LineChart, FileCheck2, Code2 } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { FadeUp, RevealWords } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const ITEMS = [
  { icon: Network, title: "The Athlete Graph", body: "Every Division I athlete, across every sport, with audience, performance and deal history linked in one model.", span: "md:col-span-2", big: true },
  { icon: ScanSearch, title: "AI signal audit", body: "Finds bots, engagement pods and purchased followers before they distort a price.", span: "" },
  { icon: Workflow, title: "Campaign OS", body: "Briefs, contracts, content review and payouts for one athlete or five hundred.", span: "" },
  { icon: LineChart, title: "Roster value", body: "Portfolio view of a whole program: value, trajectory, cap allocation, retention risk.", span: "" },
  { icon: FileCheck2, title: "Deal files", body: "Fair-market evidence, ready for NIL Go, with every contract.", span: "" },
  { icon: Code2, title: "ArcScore API", body: "Use the score in your own tools: athletic department systems, agency CRMs, brand dashboards.", span: "md:col-span-2" },
];

function GraphArt() {
  const nodes = Array.from({ length: 22 }, (_, i) => ({ x: 20 + ((i * 47) % 360), y: 20 + ((i * 83) % 140), r: 2 + (i % 4) }));
  return (
    <svg viewBox="0 0 400 180" className="absolute inset-x-0 bottom-0 h-40 w-full opacity-70" aria-hidden>
      {nodes.map((a, i) =>
        nodes.slice(i + 1, i + 3).map((b, j) => <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#5ad1ff" strokeOpacity=".18" />)
      )}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={i % 3 ? "#5ad1ff" : "#c6ff3d"}>
          <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + (i % 5) * 0.6}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

export function Platform() {
  return (
    <section className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="eyebrow mb-6">07 · Platform</p>
        <h2 className="display max-w-4xl text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold">
          <RevealWords text="One data layer under" /> <span className="text-chalk/35"><RevealWords text="the whole NIL market." delay={0.25} /></span>
        </h2>
        <div className="mt-14 grid auto-rows-[minmax(220px,auto)] gap-4 md:grid-cols-4">
          {ITEMS.map((it, i) => (
            <FadeUp key={it.title} delay={i * 0.06} className={cn(it.span)}>
              <GlowCard className="h-full">
                <div className={cn("relative h-full overflow-hidden p-7", it.big && "min-h-[300px]")}>
                  <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-lime"><it.icon size={20} /></div>
                  <h3 className="display mt-6 text-xl font-bold">{it.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-chalk/55">{it.body}</p>
                  {it.big && <GraphArt />}
                </div>
              </GlowCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
