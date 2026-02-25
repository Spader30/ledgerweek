"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-10 shadow-soft">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <Badge>Weekly OS for wedding & event vendors</Badge>
            <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.35}}
              className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Control your week. Protect your income.
            </motion.h1>
            <p className="mt-4 text-white/70 md:text-lg">
              LedgerWeek enforces delivery, pipeline minimums, and invoice awareness — and measures stability with a single Revenue Risk Score.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login"><Button className="w-full sm:w-auto">Start free</Button></Link>
              <Link href="/how-it-works"><Button variant="secondary" className="w-full sm:w-auto">See how it works</Button></Link>
            </div>
            <div className="mt-6 text-xs text-white/50">Built for solo operators • No integrations required • 7-minute Weekly Reset</div>
          </div>
          <div className="hidden md:block">
            <div className="h-64 w-80 rounded-[2rem] border border-white/10 bg-[#0B1020] p-6">
              <div className="text-sm text-white/60">Revenue Risk Score</div>
              <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-5xl font-semibold">86</div>
                <div className="mt-1 text-sm text-emerald-200/90">Stable</div>
                <div className="mt-4 text-xs text-white/50">
                  You’re meeting pipeline + billable + invoice + delivery thresholds.
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-white/70">
                <div>• 4 follow-ups this week</div>
                <div>• 8.5h billable planned</div>
                <div>• 1 invoice overdue</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
