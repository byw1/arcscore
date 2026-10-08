import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { DEALS, OPPORTUNITIES, PERSONAS, type Deal, type DealStage, type FileStatus, type Member, type PersonaKey, type Role } from "./data";

/*
  The whole demo runs in the browser. State starts from the fixed dataset and
  any change (moving a deal, inviting a teammate) is kept in localStorage so it
  survives a reload. "Reset demo" puts everything back.
*/

type State = {
  persona: PersonaKey | null;
  deals: Deal[];
  members: Record<PersonaKey, Member[]>;
  shortlist: string[]; // athlete ids
  opportunities: Record<string, "open" | "accepted" | "declined">;
  allocations: Record<string, number>; // athleteId -> rev-share override
  toast: string | null;
};

type Action =
  | { type: "login"; persona: PersonaKey }
  | { type: "logout" }
  | { type: "reset" }
  | { type: "moveDeal"; id: string; stage: DealStage }
  | { type: "setFile"; id: string; file: FileStatus }
  | { type: "addDeal"; deal: Deal }
  | { type: "invite"; member: Member }
  | { type: "setRole"; id: string; role: Role }
  | { type: "removeMember"; id: string }
  | { type: "toggleShortlist"; athleteId: string }
  | { type: "respond"; id: string; answer: "accepted" | "declined" }
  | { type: "allocate"; athleteId: string; amount: number }
  | { type: "toast"; text: string | null };

const KEY = "arcscore-demo-v1";

function initial(): State {
  return {
    persona: null,
    deals: DEALS,
    members: { brand: PERSONAS.brand.members, school: PERSONAS.school.members, athlete: PERSONAS.athlete.members },
    shortlist: [],
    opportunities: Object.fromEntries(OPPORTUNITIES.map((o) => [o.id, "open" as const])),
    allocations: {},
    toast: null,
  };
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...initial(), ...JSON.parse(raw), toast: null };
  } catch {
    /* private mode or bad JSON: start fresh */
  }
  return initial();
}

function reducer(s: State, a: Action): State {
  const p = s.persona ?? "brand";
  switch (a.type) {
    case "login":
      return { ...s, persona: a.persona };
    case "logout":
      return { ...s, persona: null };
    case "reset":
      return { ...initial(), persona: s.persona, toast: "Demo reset" };
    case "moveDeal":
      return { ...s, deals: s.deals.map((d) => (d.id === a.id ? { ...d, stage: a.stage, updated: "2026-10-08" } : d)) };
    case "setFile":
      return { ...s, deals: s.deals.map((d) => (d.id === a.id ? { ...d, file: a.file, updated: "2026-10-08" } : d)) };
    case "addDeal":
      return { ...s, deals: [a.deal, ...s.deals] };
    case "invite":
      return { ...s, members: { ...s.members, [p]: [...s.members[p], a.member] } };
    case "setRole":
      return { ...s, members: { ...s.members, [p]: s.members[p].map((m) => (m.id === a.id ? { ...m, role: a.role } : m)) } };
    case "removeMember":
      return { ...s, members: { ...s.members, [p]: s.members[p].filter((m) => m.id !== a.id) } };
    case "toggleShortlist":
      return {
        ...s,
        shortlist: s.shortlist.includes(a.athleteId) ? s.shortlist.filter((x) => x !== a.athleteId) : [...s.shortlist, a.athleteId],
      };
    case "respond":
      return { ...s, opportunities: { ...s.opportunities, [a.id]: a.answer } };
    case "allocate":
      return { ...s, allocations: { ...s.allocations, [a.athleteId]: a.amount } };
    case "toast":
      return { ...s, toast: a.text };
  }
}

const Ctx = createContext<{ state: State; dispatch: (a: Action) => void } | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => {
    try {
      const { toast: _t, ...rest } = state;
      localStorage.setItem(KEY, JSON.stringify(rest));
    } catch {
      /* storage unavailable: demo still works for this visit */
    }
  }, [state]);
  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: "toast", text: null }), 2600);
    return () => clearTimeout(t);
  }, [state.toast]);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo outside DemoProvider");
  const persona = PERSONAS[v.state.persona ?? "brand"];
  return { ...v, persona, toast: (text: string) => v.dispatch({ type: "toast", text }) };
}
