import { FadeUp } from "@/components/ui/reveal";

export function Founder() {
  return (
    <section className="relative py-28 md:py-36">
      <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
        <p className="eyebrow mb-8">08 · Why us</p>
        <FadeUp>
          <p className="display text-[clamp(1.8rem,4vw,3.4rem)] font-bold leading-[1.08]">
            Brands don't buy followers. <span className="text-gradient">They buy customers.</span>
          </p>
        </FadeUp>
        <FadeUp delay={0.15}>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-chalk/60">
            ArcScore was founded by the former Chief Customer Officer of Bath &amp; Body Works. Our thesis: the customer-data discipline behind modern retail (segmentation, lifetime value, measured lift) should set the value of every athlete's name, image and likeness.
          </p>
        </FadeUp>
        <FadeUp delay={0.25}>
          <div className="mx-auto mt-12 grid max-w-3xl gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
            {[
              ["Retail-grade data", "Customer-file matching, not follower counts"],
              ["Explainable", "Every score shows what drove it"],
              ["Neutral", "Works with any marketplace or school platform"],
            ].map(([t, d]) => (
              <div key={t} className="bg-ink p-6 text-left">
                <div className="font-semibold">{t}</div>
                <div className="mt-1 text-sm text-chalk/50">{d}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
