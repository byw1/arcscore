// Adapted from the Magic UI "Shimmer Button" + 21st.dev magnetic button patterns.
import { useRef, type ComponentProps } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = ComponentProps<"a"> & { variant?: "primary" | "ghost" };

export function ShimmerButton({ className, children, variant = "primary", ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  return (
    <motion.a
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.18);
        y.set((e.clientY - r.top - r.height / 2) * 0.3);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-sm font-semibold tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime",
        variant === "primary"
          ? "bg-lime text-ink shadow-[0_0_40px_-8px_rgba(198,255,61,0.7)] hover:bg-[#d4ff6b]"
          : "border border-white/15 bg-white/[0.03] text-chalk backdrop-blur hover:border-white/30 hover:bg-white/[0.07]",
        className
      )}
      {...(props as object)}
    >
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.55)_50%,transparent_65%)] bg-[length:200%_100%] mix-blend-overlay"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.a>
  );
}
