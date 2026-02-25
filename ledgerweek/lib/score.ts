import type { Client, Deliverable, Invoice, PipelineTouch, Profile, WeekCard } from "@/store/types";
import { addDaysISO, daysBetweenISO, isoDate, startOfWeekISO } from "./dates";

export type ScoreBreakdown = {
  score: number;
  label: "Stable" | "Warning" | "Risk";
  reasons: Array<{ title: string; delta: number; detail: string }>;
  metrics: {
    pipelineTouches: number;
    billableHoursScheduled: number;
    overdueInvoices: number;
    deliverablesAtRisk: number;
  };
};

export function computeRevenueRiskScore(args: {
  profile: Profile;
  clients: Client[];
  deliverables: Deliverable[];
  invoices: Invoice[];
  touches: PipelineTouch[];
  nowISO?: string;
}): ScoreBreakdown {
  const nowISO = args.nowISO ?? isoDate(new Date());
  const weekStart = isoDate(startOfWeekISO(new Date(nowISO + "T00:00:00")));
  const weekEnd = addDaysISO(weekStart, 7);

  const touchesThisWeek = args.touches.filter(t => t.date >= weekStart && t.date < weekEnd).length;
  const billableHours = Math.max(0, args.profile.weeklyBillableHoursPlanned ?? 0);
  const overdueInvoices = args.invoices.filter(inv => !inv.paid && daysBetweenISO(inv.dueDate, nowISO) > args.profile.invoiceGraceDays).length;

  const in14 = addDaysISO(nowISO, 14);
  const deliverablesAtRisk = args.deliverables.filter(d => d.dueDate <= in14 && d.completionPercent < 50).length;

  let score = 100;
  const reasons: ScoreBreakdown["reasons"] = [];

  if (touchesThisWeek < args.profile.weeklyPipelineTarget) {
    const delta = -20;
    score += delta;
    reasons.push({ title:"Pipeline minimum missed", delta, detail:`This week: ${touchesThisWeek}. Target: ${args.profile.weeklyPipelineTarget}.` });
  }
  if (billableHours < args.profile.weeklyBillableTargetHours) {
    const delta = -25;
    score += delta;
    reasons.push({ title:"Billable hours below target", delta, detail:`Planned: ${billableHours}h. Target: ${args.profile.weeklyBillableTargetHours}h.` });
  }
  if (overdueInvoices > 0) {
    const delta = -15 * overdueInvoices;
    score += delta;
    reasons.push({ title:"Overdue invoices", delta, detail:`${overdueInvoices} invoice(s) overdue > ${args.profile.invoiceGraceDays} days.` });
  }
  if (deliverablesAtRisk > 0) {
    const delta = -20;
    score += delta;
    reasons.push({ title:"Deliverables at risk", delta, detail:`${deliverablesAtRisk} deliverable(s) due in 14 days are < 50% complete.` });
  }

  score = Math.max(0, Math.min(100, score));
  const label = score >= 80 ? "Stable" : score >= 60 ? "Warning" : "Risk";
  if (reasons.length === 0) reasons.push({ title:"All systems stable", delta:0, detail:"You’re meeting pipeline + billable + invoice + delivery thresholds." });

  return { score, label, reasons, metrics: { pipelineTouches: touchesThisWeek, billableHoursScheduled: billableHours, overdueInvoices, deliverablesAtRisk } };
}

export function buildWeekCard(args: {
  profile: Profile;
  clients: Client[];
  deliverables: Deliverable[];
  invoices: Invoice[];
  touches: PipelineTouch[];
  weekStartISO?: string;
}): WeekCard {
  const now = new Date();
  const weekStartISO = args.weekStartISO ?? isoDate(startOfWeekISO(now));
  const res = computeRevenueRiskScore({
    profile: args.profile,
    clients: args.clients,
    deliverables: args.deliverables,
    invoices: args.invoices,
    touches: args.touches,
    nowISO: isoDate(now)
  });

  return {
    id: weekStartISO,
    weekStartISO,
    createdAtISO: isoDate(now),
    score: res.score,
    label: res.label,
    metrics: res.metrics,
    notes: "",
    actions: []
  };
}
