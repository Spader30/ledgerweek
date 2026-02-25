"use client";
import Link from "next/link";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useState } from "react";
export default function PricingCards(){
  const [annual,setAnnual]=useState(true);
  const price=(m:number)=>annual?Math.floor(m*10):m;
  const suffix=annual?"/yr":"/mo";
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button onClick={()=>setAnnual(!annual)} className="relative h-7 w-12 rounded-full border border-white/10 bg-white/10" type="button" aria-label="toggle billing">
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${annual?'left-6':'left-1'}`}/>
        </button>
        <span className="text-sm text-white/70">{annual?"Annual billing (2 months free)":"Monthly billing"}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between"><div className="text-sm text-white/60">Solo</div><Badge>Most common</Badge></div>
          <div className="mt-2 text-4xl font-semibold">${price(39)}<span className="text-base text-white/60">{suffix}</span></div>
          <ul className="mt-4 space-y-2 text-white/70">
            <li>Revenue Risk Score</li><li>Weekly Reset + Recovery Mode</li><li>Clients, deliverables, invoices, pipeline touches</li><li>Week Card archive</li>
          </ul>
          <Link href="/login" className="mt-6 block"><Button className="w-full">Start free</Button></Link>
          <p className="mt-3 text-xs text-white/50">MVP pricing. Includes early access to niche packs.</p>
        </Card>
        <Card>
          <div className="text-sm text-white/60">Studio</div>
          <div className="mt-2 text-4xl font-semibold">${price(79)}<span className="text-base text-white/60">{suffix}</span></div>
          <ul className="mt-4 space-y-2 text-white/70">
            <li>Multiple pipelines (coming soon)</li><li>Templates by vendor type</li><li>Advanced score insights</li><li>Priority feature requests</li>
          </ul>
          <Link href="/login" className="mt-6 block"><Button variant="secondary" className="w-full">Join waitlist</Button></Link>
          <p className="mt-3 text-xs text-white/50">Studio is early access while the core OS stabilizes.</p>
        </Card>
      </div>
    </div>
  );
}
