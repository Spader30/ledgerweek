"use client";

import { AppShell } from "@/components/app/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useLedgerStore } from "@/store/useLedgerStore";
import { useEffect, useMemo, useState } from "react";
import { computeRevenueRiskScore } from "@/lib/score";
import { WeeklyResetWizard, RecoveryModeWizard } from "@/components/app/wizards";
import Link from "next/link";
import { formatShort, isoDate } from "@/lib/dates";

export default function DashboardPage() {
  const profile = useLedgerStore((s) => s.profile);
  const clients = useLedgerStore((s) => s.clients);
  const deliverables = useLedgerStore((s) => s.deliverables);
  const invoices = useLedgerStore((s) => s.invoices);
  const touches = useLedgerStore((s) => s.touches);
  const weekCards = useLedgerStore((s) => s.weekCards);

  const [loading, setLoading] = useState(false);
  const [serverScore, setServerScore] = useState<any>(null);

  const localScore = useMemo(() => {
    if (!profile) return null;
    return computeRevenueRiskScore({ profile, clients, deliverables, invoices, touches });
  }, [profile, clients, deliverables, invoices, touches]);

  const tone = (label?: string) => (label === "Stable" ? "good" : label === "Warning" ? "warn" : "risk");

  const dueSoon = useMemo(() => {
    const today = isoDate(new Date());
    const in14 = new Date(today + "T00:00:00");
    in14.setDate(in14.getDate() + 14);
    const in14iso = in14.toISOString().slice(0, 10);
    return deliverables
      .filter((d) => d.dueDate <= in14iso)
      .sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))
      .slice(0, 5);
  }, [deliverables]);

  const unpaid = useMemo(() => invoices.filter((i) => !i.paid).slice(0, 5), [invoices]);

  const fetchServerScore = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, clients, deliverables, invoices, touches }),
      });
      const data = await res.json();
      setServerScore(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) fetchServerScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const score = serverScore ?? localScore;

  return (
    <AppShell>
      {!profile ? (
        <Card>
          <div className="text-lg font-semibold">Finish setup</div>
          <p className="mt-2 text-white/70">Complete onboarding to configure targets and scoring.</p>
          <Link href="/onboarding" className="mt-4 inline-block">
            <Button>Go to onboarding</Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
              <p className="mt-2 text-white/70">Delivery + pipeline + invoices — measured as one Revenue Risk Score.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={fetchServerScore} disabled={loading}>
                {loading ? <span className="inline-flex items-center gap-2"><Loader /> Refresh</span> : "Refresh score"}
              </Button>
              <WeeklyResetWizard onDone={fetchServerScore} />
              <RecoveryModeWizard onDone={fetchServerScore} />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-white/60">Revenue Risk Score</div>
                  <div className="mt-2 flex items-end gap-3">
                    <div className="text-5xl font-semibold">{score?.score ?? "—"}</div>
                    <Badge tone={tone(score?.label)}>{score?.label ?? "—"}</Badge>
                  </div>
                  <div className="mt-3 text-sm text-white/70">
                    Keep your week stable by delivering work, following up with leads, and getting paid on time.
                  </div>
                </div>
                <div className="hidden sm:block rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                  <div className="text-white/60">This week</div>
                  <div className="mt-2 space-y-1 text-white/80">
                    <div>{score?.metrics?.pipelineTouches ?? 0} touches</div>
                    <div>{score?.metrics?.billableHoursScheduled ?? 0}h planned</div>
                    <div>{score?.metrics?.overdueInvoices ?? 0} overdue invoices</div>
                    <div>{score?.metrics?.deliverablesAtRisk ?? 0} deliverables at risk</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {(score?.reasons ?? []).slice(0, 4).map((r: any) => (
                  <div key={r.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{r.title}</div>
                      <div className="text-xs text-white/50">{r.delta <= 0 ? r.delta : `+${r.delta}`}</div>
                    </div>
                    <div className="mt-2 text-sm text-white/70">{r.detail}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="text-sm text-white/60">Week Cards</div>
              <div className="mt-3 space-y-2">
                {weekCards.slice(0, 4).map((c) => (
                  <Link key={c.id} href="/history" className="block rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">{formatShort(c.weekStartISO)}</div>
                      <Badge tone={tone(c.label)}>{c.score}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-white/60">{c.metrics.pipelineTouches} touches • {c.metrics.billableHoursScheduled}h • {c.metrics.overdueInvoices} overdue</div>
                  </Link>
                ))}
                {weekCards.length === 0 && <div className="text-sm text-white/50">No week cards yet. Run Weekly Reset.</div>}
              </div>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Card>
              <div className="text-sm text-white/60">Deliverables due soon</div>
              <div className="mt-3 space-y-2">
                {dueSoon.length === 0 ? (
                  <div className="text-sm text-white/50">No upcoming deliverables.</div>
                ) : (
                  dueSoon.map((d) => (
                    <div key={d.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">{d.title}</div>
                        <Badge tone={d.completionPercent < 50 ? "warn" : "good"}>{d.completionPercent}%</Badge>
                      </div>
                      <div className="mt-1 text-xs text-white/60">Due {formatShort(d.dueDate)}</div>
                    </div>
                  ))
                )}
              </div>
              <Link href="/deliverables" className="mt-3 inline-block text-sm text-white/70 hover:text-white">Manage deliverables →</Link>
            </Card>

            <Card>
              <div className="text-sm text-white/60">Pipeline discipline</div>
              <div className="mt-3 text-sm text-white/70">Log quick touches to protect revenue: follow-ups, inquiries, referral asks.</div>
              <Link href="/clients" className="mt-4 inline-block"><Button variant="secondary">Go to Clients</Button></Link>
            </Card>

            <Card>
              <div className="text-sm text-white/60">Unpaid invoices</div>
              <div className="mt-3 space-y-2">
                {unpaid.length === 0 ? (
                  <div className="text-sm text-white/50">No unpaid invoices.</div>
                ) : (
                  unpaid.map((i) => (
                    <div key={i.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">{i.title}</div>
                        <Badge tone={i.paid ? "good" : "risk"}>${i.amount}</Badge>
                      </div>
                      <div className="mt-1 text-xs text-white/60">Due {formatShort(i.dueDate)}</div>
                    </div>
                  ))
                )}
              </div>
              <Link href="/invoices" className="mt-3 inline-block text-sm text-white/70 hover:text-white">Manage invoices →</Link>
            </Card>
          </div>
        </>
      )}
    </AppShell>
  );
}
