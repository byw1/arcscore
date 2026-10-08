// Adapted from the Magic UI "Animated Beam" component on 21st.dev.
import { useEffect, useId, useState, type RefObject } from "react";
import { motion } from "framer-motion";

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  duration = 3,
  delay = 0,
  reverse = false,
  color = "#c6ff3d",
  colorTo = "#5ad1ff",
  dim = false,
}: {
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  duration?: number;
  delay?: number;
  reverse?: boolean;
  color?: string;
  colorTo?: string;
  dim?: boolean;
}) {
  const id = useId();
  const [d, setD] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => {
      const c = containerRef.current, a = fromRef.current, b = toRef.current;
      if (!c || !a || !b) return;
      const cr = c.getBoundingClientRect(), ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
      setSize({ w: cr.width, h: cr.height });
      const sx = ar.left - cr.left + ar.width / 2, sy = ar.top - cr.top + ar.height / 2;
      const ex = br.left - cr.left + br.width / 2, ey = br.top - cr.top + br.height / 2;
      setD(`M ${sx},${sy} Q ${(sx + ex) / 2},${(sy + ey) / 2 - curvature} ${ex},${ey}`);
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [containerRef, fromRef, toRef, curvature]);

  const gid = `beam-${id.replace(/:/g, "")}`;
  return (
    <svg className="pointer-events-none absolute left-0 top-0" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} fill="none" aria-hidden>
      <path d={d} stroke="white" strokeOpacity={0.08} strokeWidth={1.5} />
      {!dim && (
        <path d={d} stroke={`url(#${gid})`} strokeWidth={2} strokeLinecap="round" />
      )}
      <defs>
        <motion.linearGradient
          id={gid}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
          animate={
            reverse
              ? { x1: ["90%", "-10%"], x2: ["100%", "0%"], y1: ["0%", "0%"], y2: ["0%", "0%"] }
              : { x1: ["10%", "110%"], x2: ["0%", "100%"], y1: ["0%", "0%"], y2: ["0%", "0%"] }
          }
          transition={{ delay, duration, ease: [0.16, 1, 0.3, 1], repeat: Infinity, repeatDelay: 0.4 }}
        >
          <stop stopColor={color} stopOpacity="0" />
          <stop stopColor={color} />
          <stop offset="32.5%" stopColor={colorTo} />
          <stop offset="100%" stopColor={colorTo} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}
