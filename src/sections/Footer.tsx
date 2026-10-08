import { Logo } from "./Nav";
import { APP_URL } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-chalk/45">The valuation and placement engine for college NIL. Know your worth. See your value.</p>
        </div>
        {[
          ["Product", [["The Score", "#score"], ["How it works", "#how"], ["Compliance", "#compliance"], ["Log in", APP_URL]]],
          ["Solutions", [["For brands", "#brands"], ["For schools", "#schools"], ["For athletes", "#athletes"]]],
          ["Company", [["Contact", "https://arcscore.ai/contact"], ["Help", "https://arcscore.ai/help"], ["Book a demo", "#demo"]]],
        ].map(([h, links]) => (
          <div key={h as string}>
            <p className="eyebrow mb-4">{h as string}</p>
            <ul className="space-y-2.5">
              {(links as string[][]).map(([l, href]) => (
                <li key={l}><a href={href} className="text-sm text-chalk/60 transition hover:text-lime">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-wrap justify-between gap-4 px-4 font-mono text-[11px] text-chalk/30 md:px-8">
        <span>© {new Date().getFullYear()} ArcScore, Inc.</span>
        <span>Sample profiles on this page are illustrative. Market figures are third-party estimates.</span>
      </div>
    </footer>
  );
}
