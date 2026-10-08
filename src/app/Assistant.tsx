import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Check, Loader2 } from "lucide-react";
import { useDemo } from "@/demo/store";
import { ATHLETES, fmtCount, fmtMoney, fmtRange, marketValue, schoolById, type Athlete, type PersonaKey } from "@/demo/data";
import { Mark } from "@/components/ui/logo";
import { Button, Sheet } from "@/components/ui/primitives";

/*
  "Ask Arc": a scripted assistant for the demo. It shows its work (the steps
  it ran), streams the answer, and ends in cards the user can act on.
  No model is called; answers are computed from the demo dataset.
*/

type Turn =
  | { role: "user"; text: string }
  | { role: "arc"; steps: string[]; text: string; cards?: Athlete[] };

const top = (list: Athlete[], k: (a: Athlete) => number, n = 3) => [...list].sort((a, b) => k(b) - k(a)).slice(0, n);

function answer(q: string, persona: PersonaKey): Omit<Extract<Turn, { role: "arc" }>, "role"> {
  void q; // demo: answers are chosen by workspace, not parsed from the question
  const lsu = ATHLETES.filter((a) => a.schoolId === "lsu");
  if (persona === "school") {
    const risky = lsu.filter((a) => a.portalRisk !== "Low").sort((a, b) => b.score - a.score).slice(0, 3);
    return {
      steps: [`Loaded Lakeshore State roster (${lsu.length} athletes)`, "Compared revenue share to fair-market value", "Ranked by score and portal exposure"],
      text: `These ${risky.length} athletes are paid well under their market value. Moving about ${fmtMoney(risky.reduce((s, a) => s + Math.max(0, marketValue(a) * 0.7 - a.revShare), 0))} from lower-arc allocations would bring all of them to a safe level without raising total spend.`,
      cards: risky,
    };
  }
  if (persona === "admin") {
    return {
      steps: ["Read usage for 8 client workspaces", "Compared seat use with renewal dates", "Flagged accounts with falling activity"],
      text: "Summit Auto Group is the one to call this week: one of three seats is in use, activity is down for six straight weeks, and it renews in November. Ridgeview's pilot is slow but steady; a roster import would likely unlock it. Everyone else is healthy.",
    };
  }
  if (persona === "athlete") {
    return {
      steps: ["Read your last 26 weeks of posts", "Compared you with 1,240 Power 4 wide receivers", "Found the factors with the most room"],
      text: "Your weakest factor is Integrity (79), mostly because your brand-safety review isn't finished. Completing it is worth about 3 points. After that, two training reels a week would lift Resonance, where you already beat 91% of comparable receivers.",
    };
  }
  const brief = ATHLETES.filter((a) => a.available && a.ageMix[1] > 40);
  const picks = top(brief, (a) => a.factors.fit * 0.5 + a.arc * 2 - a.fmv[0] / 4000);
  return {
    steps: ["Read brief: Northline Zero, 18–24, Midwest", "Scored 84 athletes on fit and price", "Removed athletes in competing hydration deals"],
    text: `These three fit best for the price. Together they reach about ${fmtCount(picks.reduce((s, a) => s + a.audience, 0))} real followers, at least ${Math.min(...picks.map((a) => a.ageMix[1]))}% of them aged 18–24, and all three are rising.`,
    cards: picks,
  };
}

const SUGGEST: Record<PersonaKey, string[]> = {
  brand: ["Who should we add to March run?", "Find underpriced athletes in the Midwest", "Which deals need attention?"],
  school: ["Who is at portal risk?", "Where can we find money outside the cap?", "Summarize this week"],
  athlete: ["How do I grow my score?", "Is the Northline offer fair?", "What should I post this week?"],
  admin: ["Which clients need attention?", "How did the last model change move scores?", "Is any data source unhealthy?"],
};

export function Assistant() {
  const { state, dispatch, persona } = useDemo();
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  useEffect(() => setTurns([]), [state.persona]);
  useEffect(() => scroller.current?.scrollTo({ top: 1e6, behavior: "smooth" }), [turns]);

  async function ask(q: string) {
    if (!q.trim() || busy) return;
    setDraft("");
    setBusy(true);
    const a = answer(q, state.persona!);
    setTurns((t) => [...t, { role: "user", text: q }, { role: "arc", steps: [], text: "" }]);
    const patch = (fn: (x: Extract<Turn, { role: "arc" }>) => Extract<Turn, { role: "arc" }>) =>
      setTurns((t) => [...t.slice(0, -1), fn(t[t.length - 1] as Extract<Turn, { role: "arc" }>)]);
    for (const s of a.steps) {
      await new Promise((r) => setTimeout(r, 520));
      patch((x) => ({ ...x, steps: [...x.steps, s] }));
    }
    const words = a.text.split(" ");
    for (let i = 1; i <= words.length; i++) {
      await new Promise((r) => setTimeout(r, 22));
      patch((x) => ({ ...x, text: words.slice(0, i).join(" ") }));
    }
    patch((x) => ({ ...x, cards: a.cards }));
    setBusy(false);
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ y: -1 }}
        className="focus-ring fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-ink py-2.5 pl-3.5 pr-4 text-[13.5px] font-medium text-paper shadow-[var(--shadow-float)]"
      >
        <Mark invert className="h-[11px]" />
        Ask Arc
      </motion.button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Ask Arc" width={460}>
        <div className="flex h-full flex-col">
          <div ref={scroller} className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {!turns.length && (
              <div className="pt-6">
                <p className="title text-[20px]">What would you like to know?</p>
                <p className="mt-1 text-[13.5px] text-ink-3">Arc reads the same data you see, and shows its work.</p>
                <div className="mt-5 flex flex-col gap-2">
                  {SUGGEST[state.persona!].map((s) => (
                    <button key={s} onClick={() => ask(s)} className="rounded-[10px] border border-line px-3.5 py-2.5 text-left text-[13.5px] text-ink-2 transition hover:border-line-strong hover:text-ink">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {turns.map((t, i) =>
              t.role === "user" ? (
                <div key={i} className="ml-auto w-fit max-w-[85%] rounded-[14px] bg-sunken px-3.5 py-2 text-[13.5px]">{t.text}</div>
              ) : (
                <div key={i} className="space-y-3">
                  <ul className="space-y-1.5">
                    <AnimatePresence initial={false}>
                      {t.steps.map((s, k) => (
                        <motion.li key={s} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-[12.5px] text-ink-3">
                          {busy && i === turns.length - 1 && k === t.steps.length - 1 && !t.text ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} className="text-good" />}
                          {s}
                        </motion.li>
                      ))}
                    </AnimatePresence>
                    {busy && i === turns.length - 1 && !t.steps.length && (
                      <li className="flex items-center gap-2 text-[12.5px] text-ink-3"><Loader2 size={13} className="animate-spin" />Thinking</li>
                    )}
                  </ul>
                  {t.text && <p className="text-[14px] leading-relaxed text-ink">{t.text}</p>}
                  {t.cards && (
                    <div className="space-y-2">
                      {t.cards.map((a) => (
                        <motion.div key={a.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-[12px] border border-line p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="text-[13.5px] font-medium">{a.name}</div>
                              <div className="text-[12px] text-ink-3">{a.sport} · {schoolById(a.schoolId).name} · {fmtRange(a.fmv)}</div>
                            </div>
                            <div className="num text-right text-[15px] font-medium">{a.score}<span className="ml-1 text-[11.5px] text-good">↑{Math.max(0, a.arc)}</span></div>
                          </div>
                          <div className="mt-2.5 flex gap-1.5">
                            {persona.key === "brand" && (
                              <Button
                                size="sm"
                                variant={state.shortlist.includes(a.id) ? "secondary" : "primary"}
                                onClick={() => {
                                  if (!state.shortlist.includes(a.id)) dispatch({ type: "toggleShortlist", athleteId: a.id });
                                  dispatch({ type: "toast", text: `${a.name} added to shortlist` });
                                }}
                              >
                                {state.shortlist.includes(a.id) ? "Shortlisted" : "Add to shortlist"}
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => { setOpen(false); nav(`/app/athletes/${a.id}`); }}>Open profile</Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(draft);
            }}
            className="border-t border-line p-3"
          >
            <div className="flex items-center gap-2 rounded-[12px] border border-line-strong bg-surface p-1.5 pl-3.5 focus-within:border-ink">
              <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask about athletes, deals or your roster" className="flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-ink-4" />
              <button type="submit" disabled={!draft.trim() || busy} className="grid h-8 w-8 place-items-center rounded-[9px] bg-ink text-paper disabled:opacity-30" aria-label="Send">
                <ArrowUp size={15} />
              </button>
            </div>
          </form>
        </div>
      </Sheet>
    </>
  );
}
