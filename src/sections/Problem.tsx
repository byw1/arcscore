import { NumberTicker } from "@/components/ui/number-ticker";
import { FadeUp, RevealWords } from "@/components/ui/reveal";
import { Marquee } from "@/components/ui/marquee";
import { MARKET_STATS } from "@/lib/content";

const SIGNALS = [
  "Instagram", "TikTok", "YouTube", "X", "Snapchat", "Twitch", "Box scores", "Recruiting rankings", "TV windows",
  "Transfer portal", "Media mentions", "Audience demographics", "Comment sentiment", "Brand safety", "Deal history", "DMA overlap",
];

const PAINS = [
  {
    who: "Brands",
    title: "Pay for followers, miss the customer.",
    body: "Most NIL buying still starts with a follower count. Audiences that are padded, mismatched or in the wrong region burn budget, and no one measures the lift.",
  },
  {
    who: "Schools",
    title: "Allocate $20M+ from a spreadsheet.",
    body: "Revenue sharing turned every roster into a payroll. Without an objective value for each athlete, schools overpay some players and lose others to the portal.",
  },
  {
    who: "Athletes",
    title: "Don't know what they're worth.",
    body: "Most of the 200,000+ Division I athletes have never been priced. And deals that can't show fair-market value now get flagged by the NIL Go clearinghouse.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="eyebrow mb-6">01 · The problem</p>
        <h2 className="display max-w-5xl text-[clamp(2.2rem,5.5vw,4.8rem)] font-extrabold">
          <RevealWords text="NIL became a multi-billion-dollar market." />{" "}
          <span className="text-chalk/35"><RevealWords text="It's still priced on gut feel." delay={0.35} /></span>
        </h2>

        <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {MARKET_STATS.map((s, i) => (
            <div key={s.label} className="bg-ink p-7 md:p-8">
              <div className="display text-[clamp(2.4rem,4vw,3.6rem)] font-extrabold text-chalk">
                <NumberTicker value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} delay={i * 0.12} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-chalk/65">{s.label}</p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-chalk/35">{s.source}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {PAINS.map((p, i) => (
            <FadeUp key={p.who} delay={i * 0.1}>
              <div className="h-full rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-7">
                <span className="font-mono text-[11px] uppercase tracking-wider text-lime">{p.who}</span>
                <h3 className="display mt-4 text-2xl font-bold">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-chalk/60">{p.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      <div className="mt-24 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <p className="eyebrow mb-6 text-center">Signals ArcScore reads, every day</p>
        <Marquee duration="55s">
          {SIGNALS.map((s) => (
            <span key={s} className="display-condensed whitespace-nowrap text-3xl font-semibold uppercase text-chalk/25 md:text-5xl">
              {s} <span className="text-lime/50">✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
