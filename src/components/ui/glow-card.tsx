// Cursor-tracking glowing border card (21st.dev "Glowing Effect" / spotlight card pattern).
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current!.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-2/80 p-px",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
        "before:bg-[radial-gradient(420px_circle_at_var(--mx)_var(--my),rgba(198,255,61,0.45),rgba(90,209,255,0.18)_35%,transparent_60%)]",
        className
      )}
    >
      <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-ink-2">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(600px_circle_at_var(--mx)_var(--my),rgba(255,255,255,0.05),transparent_40%)]"
        />
        {children}
      </div>
    </div>
  );
}
