"use client";
import { AppShell } from "@/components/app/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLedgerStore } from "@/store/useLedgerStore";
import { formatShort } from "@/lib/dates";

export default function HistoryPage() {
  const cards = useLedgerStore((s) => s.weekCards);
  const tone = (label: string) => (label === "Stable" ? "good" : label === "Warning" ? "warn" : "risk");

  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Week Cards</h1>
        <p className="mt-2 text-white/70">Your operating history. Trends create switching costs.</p>
      </div>

      <div className="mt-8 grid gap-4">
        {cards.length === 0 ? (
          <Card>
            <div className="text-sm text-white/60">No week cards yet.</div>
            <p className="mt-2 text-white/70">Run Weekly Reset from the Dashboard to create your first Week Card.</p>
          </Card>
        ) : (
          cards.map((c) => (
            <Card key={c.id}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm text-white/60">Week of {formatShort(c.weekStartISO)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="text-4xl font-semibold">{c.score}</div>
                    <Badge tone={tone(c.label)}>{c.label}</Badge>
                  </div>
                  {c.notes && <div className="mt-2 text-sm text-white/70">{c.notes}</div>}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                  <div className="text-white/60">Metrics</div>
                  <div className="mt-2 space-y-1">
                    <div>{c.metrics.pipelineTouches} pipeline touches</div>
                    <div>{c.metrics.billableHoursScheduled}h billable planned</div>
                    <div>{c.metrics.overdueInvoices} overdue invoices</div>
                    <div>{c.metrics.deliverablesAtRisk} deliverables at risk</div>
                  </div>
                </div>
              </div>

              {c.actions.length > 0 && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-white/60">Actions</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
                    {c.actions.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </AppShell>
  );
}
