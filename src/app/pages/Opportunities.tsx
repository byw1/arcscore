import { useDemo } from "@/demo/store";
import { ATHLETES, OPPORTUNITIES, brandById, fmtMoney, fmtRange } from "@/demo/data";
import { Avatar, Button, Card, PageHeader, Status } from "@/components/ui/primitives";
import { RangeBar } from "@/components/ui/charts";

export function Opportunities() {
  const { state, dispatch } = useDemo();
  const me = ATHLETES[0];
  return (
    <>
      <PageHeader title="Opportunities" sub="Brands that want to work with you, checked against your fair-market range." />
      <div className="space-y-4">
        {OPPORTUNITIES.map((o) => {
          const b = brandById(o.brandId);
          const status = state.opportunities[o.id];
          const fair = o.offer >= me.fmv[0] * 0.85;
          return (
            <Card key={o.id}>
              <div className="flex flex-wrap items-start gap-4">
                <Avatar initials={b.name.split(" ").map((w) => w[0]).join("").slice(0, 2)} size={40} className="rounded-[10px]" />
                <div className="min-w-[220px] flex-1">
                  <div className="text-[13px] text-ink-3">{b.name} · {b.category}</div>
                  <h2 className="title mt-0.5 text-[17px]">{o.title}</h2>
                  <p className="mt-1 text-[13.5px] text-ink-2">{o.ask}</p>
                  <div className="mt-4 max-w-sm">
                    <RangeBar lo={me.fmv[0]} hi={me.fmv[1]} value={o.offer} max={34000} />
                    <p className={`text-[12.5px] ${fair ? "text-good" : "text-warn"}`}>
                      {fair ? "Fair for your profile." : "Below your range."} Your range is {fmtRange(me.fmv)} for a full campaign; this ask is smaller.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="num text-[24px] font-medium tracking-[-0.03em]">{fmtMoney(o.offer)}</div>
                  <div className="text-[12.5px] text-ink-3">{o.fit}% fit · expires {o.expires}</div>
                  <div className="mt-4 flex justify-end gap-2">
                    {status === "open" ? (
                      <>
                        <Button variant="ghost" onClick={() => dispatch({ type: "respond", id: o.id, answer: "declined" })}>Decline</Button>
                        <Button variant="primary" onClick={() => { dispatch({ type: "respond", id: o.id, answer: "accepted" }); dispatch({ type: "toast", text: `Accepted. ${b.name} will send the contract.` }); }}>Accept</Button>
                      </>
                    ) : (
                      <Status tone={status === "accepted" ? "good" : "neutral"}>{status === "accepted" ? "Accepted" : "Declined"}</Status>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
