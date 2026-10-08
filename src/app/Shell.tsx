import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutGrid, Users, Sparkles, Megaphone, FileCheck2, UsersRound, Settings, Wallet, Inbox, Search, ChevronsUpDown, LogOut, RotateCcw, Check, Menu, X,
} from "lucide-react";
import { useDemo } from "@/demo/store";
import { ATHLETES, PERSONAS, schoolById, type PersonaKey } from "@/demo/data";
import { Logo } from "@/components/ui/logo";
import { Avatar, Kbd } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { Assistant } from "./Assistant";

type NavItem = { to: string; label: string; icon: typeof LayoutGrid; end?: boolean };

const NAV: Record<PersonaKey, NavItem[]> = {
  brand: [
    { to: "/app", label: "Overview", icon: LayoutGrid, end: true },
    { to: "/app/discover", label: "Discover", icon: Sparkles },
    { to: "/app/athletes", label: "Athletes", icon: Users },
    { to: "/app/campaigns", label: "Campaigns", icon: Megaphone },
    { to: "/app/deals", label: "Deal files", icon: FileCheck2 },
  ],
  school: [
    { to: "/app", label: "Overview", icon: LayoutGrid, end: true },
    { to: "/app/roster", label: "Roster value", icon: Wallet },
    { to: "/app/athletes", label: "Athletes", icon: Users },
    { to: "/app/deals", label: "Deal files", icon: FileCheck2 },
  ],
  athlete: [
    { to: "/app", label: "My score", icon: LayoutGrid, end: true },
    { to: "/app/opportunities", label: "Opportunities", icon: Inbox },
    { to: "/app/deals", label: "My deals", icon: FileCheck2 },
  ],
};
const ORG_NAV: NavItem[] = [
  { to: "/app/team", label: "Team", icon: UsersRound },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

function WorkspaceSwitcher() {
  const { state, dispatch, persona } = useDemo();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="focus-ring flex w-full items-center gap-2.5 rounded-[10px] p-1.5 text-left transition hover:bg-sunken"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Avatar initials={persona.org.split(" ").map((w) => w[0]).slice(0, 2).join("")} tone="ink" size={30} className="rounded-[8px]" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-medium">{persona.org}</span>
          <span className="block text-[11.5px] text-ink-3">{persona.orgKind} workspace</span>
        </span>
        <ChevronsUpDown size={14} className="text-ink-3" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              role="menu"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.14 }}
              className="absolute left-0 right-0 top-full z-40 mt-1 rounded-[12px] border border-line bg-surface p-1 shadow-[var(--shadow-float)]"
            >
              <div className="px-2.5 pb-1 pt-2 text-[11.5px] text-ink-3">Switch demo workspace</div>
              {(Object.keys(PERSONAS) as PersonaKey[]).map((k) => (
                <button
                  key={k}
                  role="menuitem"
                  onClick={() => {
                    dispatch({ type: "login", persona: k });
                    setOpen(false);
                    nav("/app");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-left text-[13px] hover:bg-sunken"
                >
                  <span className="flex-1">
                    {PERSONAS[k].org}
                    <span className="ml-1.5 text-ink-3">{PERSONAS[k].orgKind}</span>
                  </span>
                  {state.persona === k && <Check size={14} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const { state } = useDemo();
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    const pool = state.persona === "school" ? ATHLETES.filter((a) => a.schoolId === "lsu") : ATHLETES;
    return pool.filter((a) => !t || `${a.name} ${a.sport} ${a.position} ${schoolById(a.schoolId).name}`.toLowerCase().includes(t)).slice(0, 7);
  }, [q, state.persona]);
  const [i, setI] = useState(0);
  useEffect(() => {
    setQ("");
    setI(0);
  }, [open]);
  useEffect(() => setI(0), [q]);
  const go = (id: string) => {
    onClose();
    nav(`/app/athletes/${id}`);
  };
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[14vh]">
          <motion.div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            role="dialog"
            aria-label="Search athletes"
            initial={{ opacity: 0, scale: 0.98, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[16px] bg-surface shadow-[var(--shadow-float)]"
          >
            <div className="flex items-center gap-2.5 border-b border-line px-4">
              <Search size={16} className="text-ink-3" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") onClose();
                  if (e.key === "ArrowDown") { e.preventDefault(); setI((v) => Math.min(results.length - 1, v + 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setI((v) => Math.max(0, v - 1)); }
                  if (e.key === "Enter" && results[i]) go(results[i].id);
                }}
                placeholder="Search athletes by name, sport or school"
                className="h-12 flex-1 bg-transparent text-[14.5px] outline-none placeholder:text-ink-4"
              />
              <Kbd>esc</Kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-1.5">
              {results.map((a, k) => (
                <li key={a.id}>
                  <button
                    onMouseEnter={() => setI(k)}
                    onClick={() => go(a.id)}
                    className={cn("flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left", k === i && "bg-sunken")}
                  >
                    <Avatar initials={a.initials} size={28} />
                    <span className="flex-1">
                      <span className="block text-[13.5px] font-medium">{a.name}</span>
                      <span className="block text-[12px] text-ink-3">{a.sport} · {a.position} · {schoolById(a.schoolId).name}</span>
                    </span>
                    <span className="num text-[14px] font-medium">{a.score}</span>
                  </button>
                </li>
              ))}
              {!results.length && <li className="px-3 py-6 text-center text-[13px] text-ink-3">No athletes match “{q}”.</li>}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Sidebar({ onSearch, onNavigate }: { onSearch: () => void; onNavigate?: () => void }) {
  const { state, dispatch, persona } = useDemo();
  const nav = useNavigate();
  const items = NAV[state.persona!];
  const link = (it: NavItem) => (
    <NavLink
      key={it.to}
      to={it.to}
      end={it.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "focus-ring group flex items-center gap-2.5 rounded-[9px] px-2.5 py-[7px] text-[13.5px] transition-colors",
          isActive ? "bg-surface font-medium text-ink shadow-[var(--shadow-card)] ring-1 ring-line" : "text-ink-2 hover:bg-sunken hover:text-ink"
        )
      }
    >
      <it.icon size={16} strokeWidth={1.8} />
      {it.label}
    </NavLink>
  );
  return (
    <div className="flex h-full flex-col gap-5 px-3 py-4">
      <div className="px-1.5 pt-1"><Logo /></div>
      <WorkspaceSwitcher />
      <button onClick={onSearch} className="focus-ring flex items-center gap-2 rounded-[9px] border border-line bg-surface px-2.5 py-[7px] text-[13px] text-ink-3 hover:border-line-strong">
        <Search size={14} />
        Search
        <span className="ml-auto"><Kbd>⌘K</Kbd></span>
      </button>
      <nav className="flex flex-col gap-0.5" aria-label="Main">{items.map(link)}</nav>
      <div>
        <div className="mb-1.5 px-2.5 text-[11.5px] text-ink-3">Organization</div>
        <nav className="flex flex-col gap-0.5" aria-label="Organization">{ORG_NAV.map(link)}</nav>
      </div>
      <div className="mt-auto space-y-3">
        <div className="rounded-[12px] border border-dashed border-line-strong p-3 text-[12px] leading-relaxed text-ink-3">
          Demo workspace. Every athlete, brand and number here is fictional, and changes stay in this browser.
          <button onClick={() => dispatch({ type: "reset" })} className="mt-2 flex items-center gap-1.5 font-medium text-ink-2 hover:text-ink">
            <RotateCcw size={12} /> Reset demo
          </button>
        </div>
        <div className="flex items-center gap-2.5 px-1.5">
          <Avatar initials={persona.user.initials} size={30} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium">{persona.user.name}</div>
            <div className="truncate text-[11.5px] text-ink-3">{persona.user.title}</div>
          </div>
          <button
            onClick={() => {
              dispatch({ type: "logout" });
              nav("/login");
            }}
            className="focus-ring rounded-md p-1.5 text-ink-3 hover:bg-sunken hover:text-ink"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Shell() {
  const { state } = useDemo();
  const [search, setSearch] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const loc = useLocation();
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch((s) => !s);
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
  useEffect(() => window.scrollTo(0, 0), [loc.pathname]);

  if (!state.persona) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 hidden w-[248px] border-r border-line bg-paper lg:block">
        <Sidebar onSearch={() => setSearch(true)} />
      </aside>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-paper/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <div className="flex items-center gap-1">
          <button onClick={() => setSearch(true)} className="rounded-md p-2" aria-label="Search"><Search size={18} /></button>
          <button onClick={() => setMobileNav(true)} className="rounded-md p-2" aria-label="Open menu"><Menu size={18} /></button>
        </div>
      </div>
      <AnimatePresence>
        {mobileNav && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div className="absolute inset-0 bg-ink/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileNav(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", stiffness: 420, damping: 40 }} className="absolute inset-y-0 left-0 w-[270px] bg-paper shadow-[var(--shadow-float)]">
              <button onClick={() => setMobileNav(false)} className="absolute right-3 top-4 rounded-md p-1.5" aria-label="Close menu"><X size={16} /></button>
              <Sidebar onSearch={() => { setMobileNav(false); setSearch(true); }} onNavigate={() => setMobileNav(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
      <main className="lg:pl-[248px]">
        <motion.div key={loc.pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }} className="mx-auto max-w-[1180px] px-4 py-8 md:px-10 md:py-10">
          <Outlet />
        </motion.div>
      </main>
      <CommandPalette open={search} onClose={() => setSearch(false)} />
      <Assistant />
      <Toast />
    </div>
  );
}

function Toast() {
  const { state } = useDemo();
  return (
    <AnimatePresence>
      {state.toast && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-[13px] text-paper shadow-[var(--shadow-float)]"
        >
          {state.toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
