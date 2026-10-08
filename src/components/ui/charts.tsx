import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
  The score gauge is the logo, drawn to scale: a half arc whose length is the
  score, with the ball where the athlete currently sits.
*/
export function ScoreArc({ score, size = 180, label = "ArcScore", arc }: { score: number; size?: number; label?: string; arc?: number }) {
  const r = 42;
  const len = Math.PI * r;
  const t = score / 100;
  const ang = Math.PI * (1 - t);
  const bx = 50 + r * Math.cos(ang);
  const by = 50 - r * Math.sin(ang);
  return (
    <div className="relative" style={{ width: size, height: size * 0.62 }}>
      <svg viewBox="0 0 100 58" className="h-full w-full overflow-visible" role="img" aria-label={`${label} ${score} out of 100`}>
        <path d="M8 50a42 42 0 0 1 84 0" fill="none" stroke="var(--color-line)" strokeWidth="3" strokeLinecap="round" />
        <motion.path
          d="M8 50a42 42 0 0 1 84 0"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={len}
          initial={{ strokeDashoffset: len }}
          animate={{ strokeDashoffset: len * (1 - t) }}
          transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
        />
        <motion.circle r="4.2" fill="var(--color-signal)" stroke="var(--color-surface)" strokeWidth="1.5" initial={{ cx: 8, cy: 50 }} animate={{ cx: bx, cy: by }} transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <div className="num font-medium tracking-[-0.05em]" style={{ fontSize: size * 0.24, lineHeight: 1 }}>{score}</div>
        <div className="mt-1 text-[11.5px] text-ink-3">
          {label}
          {arc !== undefined && <span className={cn("num ml-1.5 font-medium", arc >= 0 ? "text-good" : "text-bad")}>{arc >= 0 ? "↑" : "↓"} {Math.abs(arc)} arc</span>}
        </div>
      </div>
    </div>
  );
}

/** Score history (solid) and projected arc (dashed), with a hover crosshair. */
export function ArcChart({ history, arc, height = 200, weeksLabel = "26 weeks" }: { history: number[]; arc: number; height?: number; weeksLabel?: string }) {
  const id = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);
  const W = 640, H = height, padL = 28, padR = 12, padT = 12, padB = 24;
  const proj = useMemo(() => {
    const last = history[history.length - 1];
    return Array.from({ length: 10 }, (_, i) => Math.min(100, last + (arc * (i + 1)) / 10 * (1 - i * 0.02)));
  }, [history, arc]);
  const all = [...history, ...proj];
  const lo = Math.max(0, Math.floor((Math.min(...all) - 6) / 10) * 10);
  const hi = Math.min(100, Math.ceil((Math.max(...all) + 4) / 10) * 10);
  const n = all.length - 1;
  const x = (i: number) => padL + (i / n) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);
  const hist = history.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const nowI = history.length - 1;
  const projPath = [history[nowI], ...proj].map((v, i) => `${i ? "L" : "M"}${x(nowI + i)},${y(v)}`).join(" ");
  const area = `${hist} L${x(nowI)},${H - padB} L${x(0)},${H - padB} Z`;
  const ticks = [lo, (lo + hi) / 2, hi];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Score history over ${weeksLabel}, now ${history[nowI]}, projected ${Math.round(proj[proj.length - 1])}`}
        onPointerMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          setHover(Math.max(0, Math.min(n, Math.round(((px - padL) / (W - padL - padR)) * n))));
        }}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`fill-${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="var(--color-ink)" stopOpacity="0.07" />
            <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--color-line)" strokeDasharray={t === lo ? undefined : "2 4"} />
            <text x={padL - 8} y={y(t) + 3.5} textAnchor="end" className="fill-ink-4 font-mono text-[10px]">{t}</text>
          </g>
        ))}
        <rect x={x(nowI)} y={padT} width={x(n) - x(nowI)} height={H - padT - padB} fill="var(--color-sunken)" opacity="0.6" />
        <text x={x(nowI) + 8} y={padT + 12} className="fill-ink-3 font-mono text-[10px]">PROJECTED</text>
        <path d={area} fill={`url(#fill-${id})`} />
        <motion.path d={hist} fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }} />
        <path d={projPath} fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeDasharray="3 5" strokeLinecap="round" opacity="0.55" />
        <circle cx={x(nowI)} cy={y(history[nowI])} r="5" fill="var(--color-signal)" stroke="var(--color-surface)" strokeWidth="2" />
        <text x={padL} y={H - 6} className="fill-ink-4 font-mono text-[10px]">{weeksLabel} ago</text>
        <text x={x(nowI)} y={H - 6} textAnchor="middle" className="fill-ink-3 font-mono text-[10px]">NOW</text>
        <text x={W - padR} y={H - 6} textAnchor="end" className="fill-ink-4 font-mono text-[10px]">+10 wks</text>
        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={H - padB} stroke="var(--color-ink-3)" strokeWidth="1" />
            <circle cx={x(hover)} cy={y(all[hover])} r="4" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="2" />
          </g>
        )}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-[12px] text-paper shadow-[var(--shadow-float)]"
          style={{ left: `${(x(hover) / W) * 100}%` }}
        >
          <span className="num font-medium">{all[hover].toFixed(1)}</span>
          <span className="ml-1.5 text-paper/60">
            {hover < nowI ? `${nowI - hover} wk ago` : hover === nowI ? "Now" : `Projected, +${hover - nowI} wk`}
          </span>
        </div>
      )}
    </div>
  );
}

export function Spark({ data, width = 72, height = 22, className }: { data: number[]; width?: number; height?: number; className?: string }) {
  const lo = Math.min(...data), hi = Math.max(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - 2 - ((v - lo) / Math.max(1, hi - lo)) * (height - 4)}`).join(" ");
  const up = data[data.length - 1] >= data[0];
  return (
    <svg width={width} height={height} className={className} aria-hidden>
      <polyline points={pts} fill="none" stroke={up ? "var(--color-ink)" : "var(--color-ink-3)"} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** A labelled 0–100 bar. Single hue: the bar is ink, the value is text. */
export function Meter({ label, value, hint, emphasis }: { label: string; value: number; hint?: string; emphasis?: boolean }) {
  return (
    <div title={hint}>
      <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
        <span className="text-ink-2">{label}</span>
        <span className="num font-medium">{value}</span>
      </div>
      <div className="h-[5px] overflow-hidden rounded-full bg-sunken">
        <motion.div
          className="h-full rounded-full"
          style={{ background: emphasis ? "var(--color-signal)" : "var(--color-ink)" }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        />
      </div>
    </div>
  );
}

/** Fair-market range with the offer placed on it. */
export function RangeBar({ lo, hi, value, max }: { lo: number; hi: number; value?: number; max?: number }) {
  const top = max ?? Math.max(hi * 1.6, (value ?? 0) * 1.15);
  const pct = (v: number) => `${Math.min(100, (v / top) * 100)}%`;
  const inside = value === undefined || (value >= lo && value <= hi * 1.15);
  return (
    <div className="relative h-7">
      <div className="absolute inset-x-0 top-3 h-[3px] rounded-full bg-sunken" />
      <div className="absolute top-3 h-[3px] rounded-full bg-ink" style={{ left: pct(lo), width: `calc(${pct(hi)} - ${pct(lo)})` }} />
      {value !== undefined && (
        <div className="absolute top-0 -translate-x-1/2" style={{ left: pct(value) }}>
          <div className={cn("mx-auto h-[18px] w-[3px] rounded-full", inside ? "bg-signal" : "bg-bad")} />
        </div>
      )}
    </div>
  );
}

/** Stacked share bar for a few labelled parts (ink steps, labelled in a legend beside it). */
export function ShareBar({ parts }: { parts: { label: string; value: number }[] }) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  const shades = ["var(--color-ink)", "#4a4944", "#85837c", "#b3b0a7", "#d4d1c8"];
  return (
    <div>
      <div className="flex h-2.5 gap-[2px] overflow-hidden rounded-full">
        {parts.map((p, i) => (
          <motion.div
            key={p.label}
            title={`${p.label}: ${Math.round((p.value / total) * 100)}%`}
            style={{ background: shades[i] }}
            initial={{ width: 0 }}
            animate={{ width: `${(p.value / total) * 100}%` }}
            transition={{ duration: 0.9, delay: i * 0.05 }}
          />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12.5px] sm:grid-cols-3">
        {parts.map((p, i) => (
          <li key={p.label} className="flex items-center gap-2 text-ink-2">
            <span className="h-2 w-2 rounded-full" style={{ background: shades[i] }} />
            {p.label}
            <span className="num ml-auto text-ink-3">{Math.round((p.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
