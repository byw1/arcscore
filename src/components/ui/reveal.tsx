import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Word-by-word blur-in headline (21st.dev "Text Effect" pattern). */
/** `gradient` applies the gradient per word: background-clip text doesn't reach transformed children. */
export function RevealWords({ text, className, delay = 0, gradient }: { text: string; className?: string; delay?: number; gradient?: boolean }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={`inline-block whitespace-pre ${gradient ? "text-gradient" : ""}`}
          initial={{ opacity: 0, y: "0.4em", filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, delay: delay + i * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {w + (i < words.length - 1 ? " " : "")}
        </motion.span>
      ))}
    </span>
  );
}

export function FadeUp({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
