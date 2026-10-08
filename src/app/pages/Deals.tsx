import { useMemo, useState } from "react";
import { Check, Circle } from "lucide-react";
import { useDemo } from "@/demo/store";
import { athleteById, brandById, schoolById, fmtMoney, fmtRange, type Deal, type FileStatus } from "@/demo/data";
import { Avatar, Button, Card, PageHeader, Segmented, Sheet, Status, type StatusTone } from "@/components/ui/primitives";
import { RangeBar } from "@/components/ui/charts";

export const fileTone = (f: FileStatus): StatusTone =>
  f === "Cleared" ? "good" : f === "Needs info" ? "bad" : f === "In review" ? "pending" : f === "Ready" ? "warn" : "neutral";

type Filter = "all" | "action" | "review" | "cleared";

export function Deals() {
  const { state, dispatch } = useDemo();
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const mine = useMemo(
    () =>
      state.deals.filter((d) =>
        state.persona === "brand" ? d.brandId === "northline" : state.persona === "athlete" ? d.athleteId === "a000" : athleteById(d.athleteId)?.schoolId === "lsu"
      ),
    [state.deals, state.persona]
  );
  const rows = mine.filter((d) =>
    filter === "all" ? true : filter === "action" ? d.file === "Ready" || d.file === "Needs info" || d.file === "Draft" : filter === "review" ? d.file === "In review" : d.file === "Cleared"
  );
  const open = mine.find((d) => d.id === openId) ?? null;
  const counts = { action: mine.filter((d) => ["Ready", "Needs info", "Draft"].includes(d.file)).length, review: mine.filter((d) => d.file === "In review").length };

  return (
    <>
      <PageHeader
        title={state.persona === "athlete" ? "My deals" : "Deal files"}
        sub="Every deal over $600 goes to NIL Go. Each file carries the evidence it asks for."
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: `All ${mine.length}` },
            { value: "action", label: `Needs action ${counts.action}` },
            { value: "review", label: `In review ${counts.review}` },
            { value: "cleared", label: "Cleared" },
          ]}
        />
      </div>
      <Card pad={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-[13.5px]">
            <thead className="border-b border-line text-[12px] text-ink-3">
              <tr>
                <th className="px-4 py-2.5 text-left font-normal">Athlete</th>
                <th className="px-3 py-2.5 text-left font-normal">Brand</th>
                <th className="px-3 py-2.5 text-left font-normal">Deal</th>
                <th className="px-3 py-2.5 text-right font-normal">Amount</th>
                <th className="px-3 py-2.5 text-left font-normal">Stage</th>
                <th className="px-4 py-2.5 text-left font-normal">NIL Go file</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => {
                const a = athleteById(d.athleteId)!;
                const over = d.amount > a.fmv[1] * 1.15;
                return (
                  <tr key={d.id} onClick={() => setOpenId(d.id)} className="cursor-pointer border-b border-line/70 last:border-0 hover:bg-sunken/50">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5"><Avatar initials={a.initials} size={26} /><span className="font-medium">{a.name}</span></div>
                    </td>
                    <td className="px-3 py-2.5 text-ink-2">{brandById(d.brandId).name}</td>
                    <td className="max-w-[220px] truncate px-3 py-2.5 text-ink-2">{d.title}</td>
                    <td className={`num px-3 py-2.5 text-right ${over ? "text-bad" : ""}`}>{fmtMoney(d.amount, false)}</td>
                    <td className="px-3 py-2.5 text-ink-2">{d.stage}</td>
                    <td className="px-4 py-2.5"><Status tone={fileTone(d.file)}>{d.file}</Status></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!rows.length && <p className="px-4 py-10 text-center text-[13.5px] text-ink-3">Nothing here.</p>}
      </Card>
      <Sheet open={!!open} onClose={() => setOpenId(null)} title="Deal file">
        {open && <DealFile deal={open} onAction={(file, msg) => { dispatch({ type: "setFile", id: open.id, file }); dispatch({ type: "toast", text: msg }); }} />}
      </Sheet>
    </>
  );
}

function DealFile({ deal, onAction }: { deal: Deal; onAction: (f: FileStatus, msg: string) => void }) {
  const { state } = useDemo();
  const a = athleteById(deal.athleteId)!;
  const b = brandById(deal.brandId);
  const inRange = deal.amount >= a.fmv[0] * 0.85 && deal.amount <= a.fmv[1] * 1.15;
  const tests = [
    { label: "Payer is not associated with the school", ok: true, note: `${b.name} is verified and has no booster or collective ties to ${schoolById(a.schoolId).name}.` },
    { label: "Valid business purpose", ok: true, note: `Promotes products sold to the public: ${deal.deliverables.join(", ")}.` },
    { label: "Pay within range for comparable athletes", ok: inRange, note: inRange ? `${fmtMoney(deal.amount)} sits inside the ArcScore range of ${fmtRange(a.fmv)}.` : `${fmtMoney(deal.amount)} is above the ArcScore range of ${fmtRange(a.fmv)}. Add evidence or adjust the amount.` },
  ];
  return (
    <div className="space-y-6 p-5">
      <div>
        <div className="flex items-center justify-between">
          <Status tone={fileTone(deal.file)}>{deal.file}</Status>
          <span className="text-[12px] text-ink-3">Updated {deal.updated}</span>
        </div>
        <h3 className="title mt-3 text-[20px]">{deal.title}</h3>
        <p className="mt-1 text-[13.5px] text-ink-3">{a.name} × {b.name}</p>
      </div>
      <div className="rounded-[12px] border border-line p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-[13px] text-ink-3">Amount</span>
          <span className="num text-[22px] font-medium tracking-[-0.03em]">{fmtMoney(deal.amount, false)}</span>
        </div>
        <div className="mt-2"><RangeBar lo={a.fmv[0]} hi={a.fmv[1]} value={deal.amount} /></div>
        <p className="text-[12px] text-ink-3">ArcScore fair-market range {fmtRange(a.fmv)} · score {a.score}</p>
      </div>
      <div>
        <div className="mb-2 text-[13px] font-medium">NIL Go checks</div>
        <ul className="space-y-3">
          {tests.map((t) => (
            <li key={t.label} className="flex gap-3">
              {t.ok ? <Check size={16} className="mt-0.5 shrink-0 text-good" /> : <Circle size={16} className="mt-0.5 shrink-0 text-bad" />}
              <div>
                <div className="text-[13.5px]">{t.label}</div>
                <div className="text-[12.5px] leading-relaxed text-ink-3">{t.note}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="mb-2 text-[13px] font-medium">Deliverables</div>
        <ul className="space-y-1.5 text-[13.5px] text-ink-2">{deal.deliverables.map((d) => <li key={d}>· {d}</li>)}</ul>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-line pt-5">
        {(deal.file === "Ready" || deal.file === "Draft") && (
          <Button variant="primary" disabled={!inRange} onClick={() => onAction("In review", "Submitted to NIL Go")}>Submit to NIL Go</Button>
        )}
        {deal.file === "Needs info" && <Button variant="primary" onClick={() => onAction("In review", "Evidence attached and resubmitted")}>Attach comparables and resubmit</Button>}
        {deal.file === "In review" && state.persona === "school" && <Button variant="primary" onClick={() => onAction("Cleared", "Marked cleared")}>Mark cleared</Button>}
        {deal.file === "In review" && state.persona !== "school" && <p className="text-[13px] text-ink-3">NIL Go usually responds within 7 days.</p>}
        {deal.file === "Cleared" && <p className="text-[13px] text-good">Cleared. Payments can be released.</p>}
      </div>
    </div>
  );
}
