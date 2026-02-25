"use client";
import { cn } from "@/lib/utils";
export function Button({ children, className, variant="primary", ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary"|"secondary"|"ghost"|"danger" }) {
  const base="inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed";
  const variants={
    primary:"bg-white text-black hover:bg-white/90",
    secondary:"bg-white/10 text-white hover:bg-white/15 border border-white/10",
    ghost:"bg-transparent text-white/70 hover:text-white hover:bg-white/5",
    danger:"bg-red-500/20 text-red-100 border border-red-500/30 hover:bg-red-500/25",
  } as const;
  return <button className={cn(base, variants[variant], className)} {...props}>{children}</button>;
}
