import { cn } from "@/lib/utils";

/** The mark: one arc, one ball. The ball is the only orange in the system. */
export function Mark({ className, invert }: { className?: string; invert?: boolean }) {
  return (
    <svg viewBox="0 0 32 20" className={cn("h-[14px] w-auto", className)} aria-hidden>
      <path d="M3 17a12 12 0 0 1 24 0" fill="none" stroke={invert ? "var(--color-paper)" : "var(--color-ink)"} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="27" cy="17" r="3" fill="var(--color-signal)" />
    </svg>
  );
}

export function Logo({ className, invert }: { className?: string; invert?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Mark invert={invert} />
      <span className={cn("text-[17px] font-semibold tracking-[-0.03em]", invert ? "text-paper" : "text-ink")}>arcscore</span>
    </span>
  );
}
