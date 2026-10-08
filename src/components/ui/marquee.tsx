// Adapted from the Magic UI "Marquee" component on 21st.dev.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Marquee({
  children,
  className,
  reverse,
  repeat = 3,
  duration = "40s",
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  repeat?: number;
  duration?: string;
}) {
  return (
    <div
      className={cn("group flex overflow-hidden [--gap:3rem] [gap:var(--gap)]", className)}
      style={{ ["--duration" as string]: duration }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          aria-hidden={i > 0}
          className={cn(
            "flex shrink-0 items-center justify-around [gap:var(--gap)] animate-marquee group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
