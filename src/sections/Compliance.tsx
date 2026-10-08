import { motion } from "framer-motion";
import { Landmark, Briefcase, Scale } from "lucide-react";
import { FadeUp, RevealWords } from "@/components/ui/reveal";

const TESTS = [
  { icon: Landmark, test: "Who is paying?", nilgo: "NIL Go checks whether the payer is associated with the school.", arc: "Every brand on ArcScore is verified, and its school affiliations are disclosed up front." },
  { icon: Briefcase, test: "Is there a real business purpose?", nilgo: "The deal has to promote goods or services sold to the public.", arc: "Briefs record the deliverables, channels and audience the deal is meant to reach." },
  { icon: Scale, test: "Is the pay in range?", nilgo: "Pay has to fall within the range for comparable athletes.", arc: "Each deal file includes the athlete's ArcScore fair-market range and the comparable deals behind it." },
];

export function Compliance() {
  return (
    <section id="compliance" className="relative scroll-mt-24 py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="eyebrow mb-6">06 · Compliance</p>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <h2 className="display text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold">
            <RevealWords text="Built for the" /> <RevealWords gradient text="NIL Go era." delay={0.2} />
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-chalk/60">
            Every third-party NIL deal of $600 or more now goes through the College Sports Commission's clearinghouse, and federal policy requires fair-market value with a real business purpose. ArcScore puts together the evidence before the deal is submitted, not after it's rejected.
          </p>
        </div>

        <FadeUp className="mt-14">
          <div className="rounded-3xl border border-white/[0.08] bg-ink-2 p-6 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="eyebrow">Fair-market range · sample deal file</div>
                <div className="display mt-2 text-2xl font-bold">Instagram reel + appearance, regional hydration brand</div>
              </div>
              <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 font-mono text-xs text-lime">Within range · ready to submit</span>
            </div>
            <div className="relative mt-12 h-16">
              <div className="absolute inset-x-0 top-7 h-2 rounded-full bg-white/[0.06]" />
              <motion.div
                className="absolute top-7 h-2 rounded-full bg-gradient-to-r from-cyan to-lime"
                initial={{ left: "50%", right: "50%" }}
                whileInView={{ left: "45%", right: "35%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
              />
              <motion.div
                className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
                initial={{ left: "0%", opacity: 0 }}
                whileInView={{ left: "52.5%", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <span className="rounded-md bg-chalk px-2 py-0.5 font-mono text-[10px] font-semibold text-ink">Offer $21K</span>
                <span className="mt-1 h-6 w-0.5 bg-chalk" />
              </motion.div>
              {/* Scale: $0–$40K. Range $18K–$26K = 45%–65%; offer $21K = 52.5%. */}
              <div className="absolute inset-x-0 top-12 font-mono text-[10px] text-chalk/40">
                <span className="absolute left-0">$0</span>
                <span className="absolute left-[45%] -translate-x-1/2">$18K</span>
                <span className="absolute left-[65%] -translate-x-1/2">$26K</span>
                <span className="absolute right-0">$40K+</span>
              </div>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {TESTS.map((t) => (
                <div key={t.test} className="rounded-2xl border border-white/[0.06] bg-ink p-5">
                  <t.icon size={18} className="text-lime" />
                  <div className="mt-3 font-semibold">{t.test}</div>
                  <p className="mt-2 text-sm text-chalk/45">{t.nilgo}</p>
                  <p className="mt-3 border-t border-white/[0.06] pt-3 text-sm text-chalk/75">{t.arc}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-chalk/35">ArcScore is not affiliated with the College Sports Commission or Deloitte. Clearinghouse decisions are made by NIL Go.</p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
