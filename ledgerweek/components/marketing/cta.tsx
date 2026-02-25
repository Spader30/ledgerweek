"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
export default function CTASection(){
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10">
        <Badge>Start</Badge>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Build a stable week in under 10 minutes.</h2>
        <p className="mt-2 text-white/70">Run the Weekly Reset, get your Revenue Risk Score, and stop letting chaos decide your income.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/login"><Button className="w-full sm:w-auto">Start free</Button></Link>
          <Link href="/pricing"><Button variant="secondary" className="w-full sm:w-auto">View pricing</Button></Link>
        </div>
      </div>
    </section>
  );
}
