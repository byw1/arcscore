import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_URL } from "@/lib/content";

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("flex items-center gap-2.5", className)} aria-label="ArcScore home">
      <svg viewBox="0 0 40 28" className="h-6 w-auto" aria-hidden>
        <path d="M3 25 C 10 0, 28 0, 35 22" fill="none" stroke="url(#lg)" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="35.5" cy="22.5" r="3.6" fill="#c6ff3d" />
        <defs>
          <linearGradient id="lg" x1="0" x2="1">
            <stop stopColor="#5ad1ff" />
            <stop offset="1" stopColor="#c6ff3d" />
          </linearGradient>
        </defs>
      </svg>
      <span className="display text-[1.15rem] font-extrabold tracking-tight">
        Arc<span className="text-lime">Score</span>
      </span>
    </a>
  );
}

const LINKS = [
  ["The Score", "#score"],
  ["How it works", "#how"],
  ["Brands", "#brands"],
  ["Schools", "#schools"],
  ["Athletes", "#athletes"],
  ["Compliance", "#compliance"],
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 md:px-6",
          scrolled ? "border border-white/10 bg-ink/70 shadow-2xl shadow-black/40 backdrop-blur-xl" : "border border-transparent"
        )}
      >
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="rounded-full px-3.5 py-2 text-[13px] text-chalk/70 transition hover:bg-white/5 hover:text-chalk">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-2 lg:flex">
          <a href={APP_URL} className="rounded-full px-4 py-2 text-[13px] text-chalk/80 hover:text-chalk">
            Log in
          </a>
          <a href="#demo" className="rounded-full bg-chalk px-4 py-2 text-[13px] font-semibold text-ink transition hover:bg-lime">
            Book a demo
          </a>
        </div>
        <button className="rounded-full p-2 lg:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-3xl border border-white/10 bg-ink/95 p-4 backdrop-blur-xl lg:hidden">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-chalk/80 hover:bg-white/5">
              {label}
            </a>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <a href={APP_URL} className="rounded-full border border-white/15 px-4 py-3 text-center text-sm">Log in</a>
            <a href="#demo" onClick={() => setOpen(false)} className="rounded-full bg-lime px-4 py-3 text-center text-sm font-semibold text-ink">Book a demo</a>
          </div>
        </div>
      )}
    </header>
  );
}
