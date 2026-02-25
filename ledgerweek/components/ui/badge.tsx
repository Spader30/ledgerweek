import { cn } from "@/lib/utils";
export function Badge({ children, tone="neutral" }: { children: React.ReactNode; tone?: "neutral"|"good"|"warn"|"risk" }) {
  const toneCls =
    tone === "good" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100" :
    tone === "warn" ? "border-amber-400/20 bg-amber-400/10 text-amber-100" :
    tone === "risk" ? "border-rose-400/20 bg-rose-400/10 text-rose-100" :
    "border-white/10 bg-white/5 text-white/70";
  return <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs", toneCls)}>{children}</span>;
}
