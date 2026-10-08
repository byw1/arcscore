import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, BookmarkCheck, ArrowDown, ArrowUp } from "lucide-react";
import { useDemo } from "@/demo/store";
import { ATHLETES, SCHOOLS, schoolById, fmtCount, fmtRange, type Athlete } from "@/demo/data";
import { Avatar, Card, Input, PageHeader, Select, Status, Segmented } from "@/components/ui/primitives";
import { Spark } from "@/components/ui/charts";
import { cn } from "@/lib/utils";

type SortKey = "score" | "arc" | "audience" | "fmv";

export function Athletes() {
  const { state, dispatch } = useDemo();
  const nav = useNavigate();
  const school = state.persona === "school";
  const [q, setQ] = useState("");
  const [sport, setSport] = useState("All sports");
  const [tier, setTier] = useState<"all" | "Power 4" | "Group of 6">("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "score", dir: -1 });
  const base = school ? ATHLETES.filter((a) => a.schoolId === "lsu") : ATHLETES;
  const sports = ["All sports", ...Array.from(new Set(base.map((a) => a.sport))).sort()];

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    const val = (a: Athlete) => (sort.key === "fmv" ? a.fmv[1] : sort.key === "audience" ? a.audience : a[sort.key]);
    return base
      .filter((a) => (sport === "All sports" || a.sport === sport) && (tier === "all" || schoolById(a.schoolId).tier === tier))
      .filter((a) => !t || `${a.name} ${a.position} ${schoolById(a.schoolId).name} ${a.hometown}`.toLowerCase().includes(t))
      .sort((a, b) => (val(a) - val(b)) * sort.dir);
  }, [base, q, sport, tier, sort]);

  const Th = ({ k, children, className }: { k: SortKey; children: string; className?: string }) => (
    <th className={cn("px-3 py-2.5 text-right font-normal", className)}>
      <button
        onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? ((-s.dir) as 1 | -1) : -1 }))}
        className="inline-flex items-center gap-1 hover:text-ink"
        aria-label={`Sort by ${children}`}
      >
        {children}
        {sort.key === k && (sort.dir === -1 ? <ArrowDown size={12} /> : <ArrowUp size={12} />)}
      </button>
    </th>
  );

  return (
    <>
      <PageHeader title={school ? "Athletes" : "Athletes"} sub={school ? "Everyone on the Lakeshore State roster, scored daily" : `${ATHLETES.length} athletes in the demo index, scored daily`} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, school, hometown" className="max-w-xs" aria-label="Search athletes" />
        <Select label="Sport" value={sport} onChange={setSport} options={sports} />
        {!school && (
          <Segmented value={tier} onChange={setTier} options={[{ value: "all", label: "All" }, { value: "Power 4", label: "Power 4" }, { value: "Group of 6", label: "Group of 6" }]} />
        )}
        <span className="ml-auto text-[12.5px] text-ink-3">{rows.length} athletes</span>
      </div>
      <Card pad={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-[13.5px]">
            <thead className="border-b border-line text-[12px] text-ink-3">
              <tr>
                <th className="px-4 py-2.5 text-left font-normal">Athlete</th>
                <th className="px-3 py-2.5 text-left font-normal">School</th>
                <Th k="audience">Audience</Th>
                <Th k="fmv">Fair-market range</Th>
                <th className="px-3 py-2.5 text-right font-normal">26 weeks</th>
                <Th k="arc">Arc</Th>
                <Th k="score" className="pr-4">Score</Th>
                {!school && <th className="w-10" />}
                {school && <th className="px-4 py-2.5 text-right font-normal">Risk</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} onClick={() => nav(`/app/athletes/${a.id}`)} className="cursor-pointer border-b border-line/70 last:border-0 hover:bg-sunken/50">
                  <td className="px-4 py-2.5">
                    <Link to={`/app/athletes/${a.id}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-3">
                      <Avatar initials={a.initials} />
                      <span>
                        <span className="block font-medium">{a.name}</span>
                        <span className="block text-[12px] text-ink-3">{a.sport} · {a.position} · {a.year}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-ink-2">{schoolById(a.schoolId).name}</td>
                  <td className="num px-3 py-2.5 text-right text-ink-2">{fmtCount(a.audience)}</td>
                  <td className="num px-3 py-2.5 text-right text-ink-2">{fmtRange(a.fmv)}</td>
                  <td className="px-3 py-2.5 text-right"><Spark data={a.history} className="ml-auto" /></td>
                  <td className={cn("num px-3 py-2.5 text-right", a.arc >= 0 ? "text-good" : "text-bad")}>{a.arc >= 0 ? "↑" : "↓"}{Math.abs(a.arc)}</td>
                  <td className="num px-3 py-2.5 pr-4 text-right text-[15px] font-medium">{a.score}</td>
                  {!school && (
                    <td className="pr-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch({ type: "toggleShortlist", athleteId: a.id });
                        }}
                        className="rounded-md p-1.5 text-ink-3 hover:bg-surface hover:text-ink"
                        aria-label={state.shortlist.includes(a.id) ? `Remove ${a.name} from shortlist` : `Add ${a.name} to shortlist`}
                      >
                        {state.shortlist.includes(a.id) ? <BookmarkCheck size={16} className="text-ink" /> : <Bookmark size={16} />}
                      </button>
                    </td>
                  )}
                  {school && (
                    <td className="px-4 py-2.5 text-right">
                      <Status tone={a.portalRisk === "High" ? "bad" : a.portalRisk === "Elevated" ? "warn" : "good"}>{a.portalRisk}</Status>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && <p className="px-4 py-10 text-center text-[13.5px] text-ink-3">No athletes match these filters.</p>}
      </Card>
      <p className="mt-3 text-[12px] text-ink-4">Schools: {SCHOOLS.map((s) => s.name).join(", ")}. All fictional.</p>
    </>
  );
}
