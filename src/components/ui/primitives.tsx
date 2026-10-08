import { forwardRef, useEffect, type ButtonHTMLAttributes, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, CircleDashed, Clock, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "sm" | "md" };
export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button({ className, variant = "secondary", size = "md", ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[9px] font-medium transition-[background,box-shadow,color] duration-150 disabled:pointer-events-none disabled:opacity-40",
        size === "sm" ? "h-7 px-2.5 text-[12.5px]" : "h-9 px-3.5 text-[13.5px]",
        variant === "primary" && "bg-ink text-paper hover:bg-ink/85",
        variant === "secondary" && "border border-line-strong bg-surface text-ink shadow-[var(--shadow-card)] hover:bg-sunken/60",
        variant === "ghost" && "text-ink-2 hover:bg-sunken hover:text-ink",
        variant === "danger" && "text-bad hover:bg-bad-soft",
        className
      )}
      {...props}
    />
  );
});

export function Avatar({ initials, size = 28, className, tone = "neutral" }: { initials: string; size?: number; className?: string; tone?: "neutral" | "ink" }) {
  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full font-medium",
        tone === "ink" ? "bg-ink text-paper" : "bg-sunken text-ink-2 ring-1 ring-line ring-inset",
        className
      )}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.38) }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

const STATUS = {
  good: { cls: "bg-good-soft text-good", Icon: CheckCircle2 },
  warn: { cls: "bg-warn-soft text-warn", Icon: AlertTriangle },
  bad: { cls: "bg-bad-soft text-bad", Icon: XCircle },
  pending: { cls: "bg-sunken text-ink-2", Icon: Clock },
  neutral: { cls: "bg-sunken text-ink-3", Icon: CircleDashed },
} as const;
export type StatusTone = keyof typeof STATUS;

/** Status is never color alone: icon + label, always. */
export function Status({ tone, children, className }: { tone: StatusTone; children: ReactNode; className?: string }) {
  const { cls, Icon } = STATUS[tone];
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[12px] font-medium", cls, className)}>
      <Icon size={12} strokeWidth={2.2} aria-hidden />
      {children}
    </span>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-md border border-line bg-surface px-1.5 py-0.5 text-[12px] text-ink-2", className)}>{children}</span>;
}

export function Card({ children, className, pad = true }: { children: ReactNode; className?: string; pad?: boolean }) {
  return <section className={cn("card min-w-0", pad && "p-5", className)}>{children}</section>;
}

export function CardHeader({ title, sub, action }: { title: ReactNode; sub?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="title text-[15px]">{title}</h2>
        {sub && <p className="mt-0.5 text-[13px] text-ink-3">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, delta, foot }: { label: string; value: ReactNode; delta?: number; foot?: ReactNode }) {
  return (
    <div>
      <div className="text-[13px] text-ink-3">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="num text-[28px] font-medium tracking-[-0.035em]">{value}</span>
        {delta !== undefined && <Delta value={delta} />}
      </div>
      {foot && <div className="mt-1 text-[12.5px] text-ink-3">{foot}</div>}
    </div>
  );
}

export function Delta({ value, suffix = "" }: { value: number; suffix?: string }) {
  const up = value >= 0;
  return (
    <span className={cn("num text-[12.5px] font-medium", up ? "text-good" : "text-bad")}>
      {up ? "↑" : "↓"} {Math.abs(value)}
      {suffix}
    </span>
  );
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="title text-[26px] tracking-[-0.035em]">{title}</h1>
        {sub && <p className="mt-1 text-[14px] text-ink-3">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Segmented<T extends string>({ value, options, onChange, className }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; className?: string }) {
  return (
    <div role="tablist" className={cn("inline-flex rounded-[10px] bg-sunken p-0.5", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "focus-ring relative rounded-[8px] px-3 py-1 text-[13px] transition-colors",
            value === o.value ? "text-ink" : "text-ink-3 hover:text-ink-2"
          )}
        >
          {value === o.value && <motion.span layoutId={`seg-${options.map((x) => x.value).join("")}`} className="absolute inset-0 rounded-[8px] bg-surface shadow-[var(--shadow-card)]" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-9 w-full rounded-[9px] border border-line-strong bg-surface px-3 text-[13.5px] text-ink outline-none transition placeholder:text-ink-4 focus:border-ink focus:ring-4 focus:ring-ink/5",
        props.className
      )}
    />
  );
}

export function Select({ value, onChange, options, className, label }: { value: string; onChange: (v: string) => void; options: string[]; className?: string; label: string }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn("focus-ring h-9 rounded-[9px] border border-line-strong bg-surface px-2.5 text-[13.5px] text-ink", className)}
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

export function Sheet({ open, onClose, title, children, width = 440 }: { open: boolean; onClose: () => void; title: string; children: ReactNode; width?: number }) {
  useEffect(() => {
    if (!open) return;
    const on = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal
            aria-label={title}
            className="absolute inset-y-2 right-2 flex max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-[18px] bg-surface shadow-[var(--shadow-float)]"
            style={{ width }}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 40 }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="title text-[15px]">{title}</h2>
              <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
                <X size={16} />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const on = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <motion.div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal
            aria-label={title}
            className="relative w-full max-w-md rounded-[18px] bg-surface p-6 shadow-[var(--shadow-float)]"
            initial={{ y: 12, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 480, damping: 36 }}
          >
            <h2 className="title mb-4 text-[17px]">{title}</h2>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded border border-line bg-surface px-1.5 py-px font-mono text-[10.5px] text-ink-3">{children}</kbd>;
}
