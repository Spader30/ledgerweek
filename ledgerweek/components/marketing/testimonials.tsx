"use client";
import { Card } from "../ui/card";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
const quotes=[
  {name:"Mia K.",role:"Photographer",text:"My revenue gaps weren’t random. I was skipping follow-ups and letting invoices drift. LedgerWeek made it visible."},
  {name:"Jordan S.",role:"Planner",text:"The Weekly Reset is the first system I’ve actually repeated. It’s fast, and it tells me what matters."},
  {name:"Avery D.",role:"Videographer",text:"Recovery Mode is underrated. Missing a week used to spiral. Now it’s a reset, not a failure."},
];
export default function Testimonials(){
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8"><Badge>Proof</Badge><h2 className="mt-3 text-3xl font-semibold tracking-tight">Built for real vendor weeks.</h2></div>
      <div className="grid gap-4 md:grid-cols-3">
        {quotes.map((q,i)=>(
          <motion.div key={q.name} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.3,delay:i*0.05}}>
            <Card>
              <p className="text-white/80">“{q.text}”</p>
              <div className="mt-4 text-sm text-white/60"><span className="text-white/80">{q.name}</span> • {q.role}</div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
