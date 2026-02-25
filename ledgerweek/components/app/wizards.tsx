"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Stepper } from "@/components/ui/stepper";
import { Badge } from "@/components/ui/badge";
import { useLedgerStore } from "@/store/useLedgerStore";
import { isoDate, startOfWeekISO } from "@/lib/dates";

export function WeeklyResetWizard({ onDone }: { onDone?: () => void }) {
  const profile = useLedgerStore((s) => s.profile);
  const deliverables = useLedgerStore((s) => s.deliverables);
  const invoices = useLedgerStore((s) => s.invoices);
  const runWeeklyReset = useLedgerStore((s) => s.runWeeklyReset);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [plannedHours, setPlannedHours] = useState<number>(profile?.weeklyBillableHoursPlanned ?? profile?.weeklyBillableTargetHours ?? 8);
  const [touchesToday, setTouchesToday] = useState<number>(1);
  const [notes, setNotes] = useState("");

  const steps = ["Deliverables", "Hours", "Pipeline", "Invoices", "Confirm"];

  const dueSoon = useMemo(() => {
    const today = isoDate(new Date());
    const in14 = new Date(today + "T00:00:00");
    in14.setDate(in14.getDate() + 14);
    const in14iso = in14.toISOString().slice(0, 10);
    return deliverables
      .filter((d) => d.dueDate <= in14iso)
      .sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))
      .slice(0, 4);
  }, [deliverables]);

  const unpaid = useMemo(() => invoices.filter((i) => !i.paid).slice(0, 4), [invoices]);

  const close = () => {
    setOpen(false);
    setStep(0);
    setNotes("");
  };

  const run = () => {
    runWeeklyReset({ plannedBillableHours: plannedHours, pipelineTouchesLoggedToday: touchesToday, notes });
    close();
    onDone?.();
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
        Start Weekly Reset
      </Button>
    );
  }

  return (
    <Card className="mt-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">Weekly Reset</div>
          <div className="mt-1 text-sm text-white/60">7 minutes. Lock delivery, hours, and pipeline into reality.</div>
        </div>
        <Button variant="ghost" onClick={close}>Close</Button>
      </div>

      <div className="mt-4"><Stepper steps={steps} active={step} /></div>

      <div className="mt-6">
        {step === 0 && (
          <div>
            <div className="text-sm text-white/70">Deliverables due in 14 days</div>
            <div className="mt-3 space-y-2">
              {dueSoon.length === 0 ? (
                <div className="text-sm text-white/50">No deliverables due soon.</div>
              ) : (
                dueSoon.map((d) => (
                  <div key={d.id} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{d.title}</div>
                      <Badge tone={d.completionPercent < 50 ? "warn" : "good"}>{d.completionPercent}%</Badge>
                    </div>
                    <div className="mt-1 text-xs text-white/60">Due {d.dueDate}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-sm text-white/70">Planned billable hours this week</div>
            <Input type="number" min={0} step={0.5} className="mt-2" value={plannedHours} onChange={(e) => setPlannedHours(Number(e.target.value))} />
            <div className="mt-2 text-xs text-white/50">Target: {profile?.weeklyBillableTargetHours ?? 10}h</div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-sm text-white/70">Pipeline touches to log today</div>
            <Input type="number" min={0} step={1} className="mt-2" value={touchesToday} onChange={(e) => setTouchesToday(Number(e.target.value))} />
            <div className="mt-2 text-xs text-white/50">Weekly minimum target: {profile?.weeklyPipelineTarget ?? 3}</div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-sm text-white/70">Unpaid invoices</div>
            <div className="mt-3 space-y-2">
              {unpaid.length === 0 ? (
                <div className="text-sm text-white/50">No unpaid invoices.</div>
              ) : (
                unpaid.map((i) => (
                  <div key={i.id} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{i.title}</div>
                      <Badge tone="risk">${i.amount}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-white/60">Due {i.dueDate}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-sm text-white/70">Notes (optional)</div>
            <Textarea className="mt-2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything to remember about this week…" />
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              This will create/update a Week Card for the week starting {isoDate(startOfWeekISO(new Date()))}.
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</Button>
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep(step + 1)}>Next</Button>
        ) : (
          <Button onClick={run}>Finish Weekly Reset</Button>
        )}
      </div>
    </Card>
  );
}

export function RecoveryModeWizard({ onDone }: { onDone?: () => void }) {
  const profile = useLedgerStore((s) => s.profile);
  const weekCards = useLedgerStore((s) => s.weekCards);
  const runRecoveryMode = useLedgerStore((s) => s.runRecoveryMode);

  const [open, setOpen] = useState(false);
  const [plannedHours, setPlannedHours] = useState<number>(profile?.weeklyBillableHoursPlanned ?? 6);
  const [notes, setNotes] = useState("");

  const needsRecovery = useMemo(() => {
    if (weekCards.length === 0) return true;
    const last = weekCards[0];
    const today = isoDate(new Date());
    const lastDate = new Date(last.weekStartISO + "T00:00:00");
    const now = new Date(today + "T00:00:00");
    const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 7;
  }, [weekCards]);

  if (!needsRecovery) return null;

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)} className="w-full sm:w-auto">
        Recovery Mode
      </Button>
    );
  }

  return (
    <Card className="mt-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">Recovery Mode</div>
          <div className="mt-1 text-sm text-white/60">Generate a 48-hour rescue plan and re-enter clean.</div>
        </div>
        <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
      </div>

      <div className="mt-6">
        <div className="text-sm text-white/70">Planned billable hours (next 7 days)</div>
        <Input type="number" min={0} step={0.5} className="mt-2" value={plannedHours} onChange={(e) => setPlannedHours(Number(e.target.value))} />
        <div className="mt-2 text-xs text-white/50">Target: {profile?.weeklyBillableTargetHours ?? 10}h</div>
      </div>

      <div className="mt-6">
        <div className="text-sm text-white/70">Notes (optional)</div>
        <Textarea className="mt-2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What caused drift? What changes this week?" />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          onClick={() => {
            runRecoveryMode({ plannedBillableHours: plannedHours, notes });
            setOpen(false);
            onDone?.();
          }}
        >
          Run Recovery Mode
        </Button>
      </div>
    </Card>
  );
}
