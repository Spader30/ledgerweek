import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  const steps = [
    { t: "Track the minimum", d: "Clients, deliverables, invoices, and pipeline touches — no CRM bloat." },
    { t: "Run Weekly Reset", d: "A 7-minute ritual: set billable hours, log touches, review deliverables + invoices." },
    { t: "Get your Revenue Risk Score", d: "One number warns you before income volatility hits." },
    { t: "Recover fast", d: "Recovery Mode creates a 48-hour rescue plan if you miss a week." },
    { t: "Build operating history", d: "Week Cards capture your rhythm so the system becomes harder to replace." },
  ];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <Badge>How it works</Badge>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">A weekly operating system.</h1>
        <p className="mt-3 max-w-2xl text-white/70">Most vendors don’t need more tools. They need a repeatable rhythm that protects income.</p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {steps.map((s) => (
            <Card key={s.t}>
              <div className="text-lg font-semibold">{s.t}</div>
              <p className="mt-2 text-white/70">{s.d}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/login"><Button className="w-full sm:w-auto">Start free</Button></Link>
          <Link href="/pricing"><Button variant="secondary" className="w-full sm:w-auto">View pricing</Button></Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
