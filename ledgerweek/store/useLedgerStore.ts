"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Client, Deliverable, Invoice, PipelineTouch, Profile, WeekCard } from "./types";
import { addDaysISO, isoDate, startOfWeekISO } from "@/lib/dates";
import { buildWeekCard, computeRevenueRiskScore } from "@/lib/score";

type State = {
  profile: Profile | null;
  clients: Client[];
  deliverables: Deliverable[];
  invoices: Invoice[];
  touches: PipelineTouch[];
  weekCards: WeekCard[];

  setProfile: (p: Profile) => void;
  addClient: (c: Omit<Client, "id">) => void;
  updateClient: (id: string, patch: Partial<Client>) => void;
  removeClient: (id: string) => void;

  addDeliverable: (d: Omit<Deliverable, "id">) => void;
  updateDeliverable: (id: string, patch: Partial<Deliverable>) => void;
  removeDeliverable: (id: string) => void;

  addInvoice: (i: Omit<Invoice, "id">) => void;
  updateInvoice: (id: string, patch: Partial<Invoice>) => void;
  removeInvoice: (id: string) => void;

  addTouch: (t: Omit<PipelineTouch, "id">) => void;
  removeTouch: (id: string) => void;

  runWeeklyReset: (args: { plannedBillableHours: number; pipelineTouchesLoggedToday: number; notes?: string }) => WeekCard;
  runRecoveryMode: (args: { plannedBillableHours: number; notes?: string }) => WeekCard;

  currentScore: () => ReturnType<typeof computeRevenueRiskScore> | null;
  seedDemo: () => void;
};

function upsertWeekCard(cards: WeekCard[], card: WeekCard) {
  const idx = cards.findIndex((c) => c.weekStartISO === card.weekStartISO);
  if (idx === -1) return [card, ...cards].sort((a,b) => (a.weekStartISO < b.weekStartISO ? 1 : -1));
  const copy = [...cards];
  copy[idx] = card;
  return copy.sort((a,b) => (a.weekStartISO < b.weekStartISO ? 1 : -1));
}

function defaultProfile(): Profile {
  return {
    niche: "wedding_vendor",
    businessName: "Studio",
    role: "photographer",
    weeklyBillableTargetHours: 10,
    weeklyPipelineTarget: 3,
    invoiceGraceDays: 7,
    weeklyBillableHoursPlanned: 8,
  };
}

export const useLedgerStore = create<State>()(
  persist(
    (set, get) => ({
      profile: null,
      clients: [],
      deliverables: [],
      invoices: [],
      touches: [],
      weekCards: [],

      setProfile: (p) => set({ profile: p }),

      addClient: (c) => set({ clients: [...get().clients, { ...c, id: nanoid() }] }),
      updateClient: (id, patch) => set({ clients: get().clients.map(c => c.id === id ? { ...c, ...patch } : c) }),
      removeClient: (id) => set({ clients: get().clients.filter(c => c.id !== id) }),

      addDeliverable: (d) => set({ deliverables: [...get().deliverables, { ...d, id: nanoid() }] }),
      updateDeliverable: (id, patch) => set({ deliverables: get().deliverables.map(d => d.id === id ? { ...d, ...patch } : d) }),
      removeDeliverable: (id) => set({ deliverables: get().deliverables.filter(d => d.id !== id) }),

      addInvoice: (i) => set({ invoices: [...get().invoices, { ...i, id: nanoid() }] }),
      updateInvoice: (id, patch) => set({ invoices: get().invoices.map(i => i.id === id ? { ...i, ...patch } : i) }),
      removeInvoice: (id) => set({ invoices: get().invoices.filter(i => i.id !== id) }),

      addTouch: (t) => set({ touches: [...get().touches, { ...t, id: nanoid() }] }),
      removeTouch: (id) => set({ touches: get().touches.filter(t => t.id !== id) }),

      runWeeklyReset: ({ plannedBillableHours, pipelineTouchesLoggedToday, notes }) => {
        const profile = get().profile ?? defaultProfile();
        const today = isoDate(new Date());
        const newTouches = Array.from({ length: Math.max(0, pipelineTouchesLoggedToday) }, (_, idx) => ({
          id: nanoid(),
          date: today,
          type: "follow_up" as const,
          who: "Prospect",
          valueHint: 1000,
          notes: idx === 0 ? "Weekly reset touch" : "Follow-up",
        }));
        const updatedProfile = { ...profile, weeklyBillableHoursPlanned: plannedBillableHours };

        const card = buildWeekCard({
          profile: updatedProfile,
          clients: get().clients,
          deliverables: get().deliverables,
          invoices: get().invoices,
          touches: [...get().touches, ...newTouches],
        });
        card.actions = [
          "Weekly Reset completed",
          pipelineTouchesLoggedToday > 0 ? `Logged ${pipelineTouchesLoggedToday} pipeline touch(es)` : "No pipeline touches logged",
          `Planned ${plannedBillableHours} billable hour(s)`,
        ];
        card.notes = notes ?? "";

        set({
          profile: updatedProfile,
          touches: [...get().touches, ...newTouches],
          weekCards: upsertWeekCard(get().weekCards, card),
        });
        return card;
      },

      runRecoveryMode: ({ plannedBillableHours, notes }) => {
        const profile = get().profile ?? defaultProfile();
        const updatedProfile = { ...profile, weeklyBillableHoursPlanned: plannedBillableHours };
        const card = buildWeekCard({
          profile: updatedProfile,
          clients: get().clients,
          deliverables: get().deliverables,
          invoices: get().invoices,
          touches: get().touches,
        });
        card.actions = ["Recovery Mode used", `Planned ${plannedBillableHours} billable hour(s)`, "Rescued next 48 hours"];
        card.notes = notes ?? "";

        set({ profile: updatedProfile, weekCards: upsertWeekCard(get().weekCards, card) });
        return card;
      },

      currentScore: () => {
        const profile = get().profile;
        if (!profile) return null;
        return computeRevenueRiskScore({ profile, clients: get().clients, deliverables: get().deliverables, invoices: get().invoices, touches: get().touches });
      },

      seedDemo: () => {
        const profile = defaultProfile();
        const today = isoDate(new Date());
        const c1: Client = { id: nanoid(), name: "Jessica + Ryan", status: "booked", eventDateISO: addDaysISO(today, 45), contractValue: 4700, notes: "May wedding. Strong referral potential." };
        const c2: Client = { id: nanoid(), name: "Smith Wedding", status: "delivering", eventDateISO: addDaysISO(today, 6), contractValue: 3600, notes: "Final edits due soon." };
        const d1: Deliverable = { id: nanoid(), clientId: c2.id, title: "Highlight Reel", dueDate: addDaysISO(today, 12), completionPercent: 10, estimatedHours: 10 };
        const d2: Deliverable = { id: nanoid(), clientId: c2.id, title: "Gallery Delivery", dueDate: addDaysISO(today, 9), completionPercent: 35, estimatedHours: 6 };
        const inv1: Invoice = { id: nanoid(), clientId: c2.id, title: "Final Payment", amount: 1800, dueDate: addDaysISO(today, -10), paid: false, paidDate: null };
        const touches: PipelineTouch[] = [
          { id: nanoid(), date: today, type: "follow_up", who: "Venue Lead", valueHint: 2500, notes: "Sent follow-up" },
          { id: nanoid(), date: today, type: "inquiry", who: "Hernandez Engagement", valueHint: 950, notes: "Inbound inquiry" },
        ];
        const weekStart = isoDate(startOfWeekISO(new Date()));
        const card: WeekCard = { id: weekStart, weekStartISO: weekStart, createdAtISO: today, score: 63, label: "Warning",
          metrics: { pipelineTouches: 2, billableHoursScheduled: 8, overdueInvoices: 1, deliverablesAtRisk: 2 }, notes: "Demo data seeded.", actions: ["Demo seed"] };
        set({ profile, clients: [c1, c2], deliverables: [d1, d2], invoices: [inv1], touches, weekCards: [card] });
      }
    }),
    {
      name: "ledgerweek_v1",
      version: 1,
      partialize: (s) => ({ profile: s.profile, clients: s.clients, deliverables: s.deliverables, invoices: s.invoices, touches: s.touches, weekCards: s.weekCards }),
    }
  )
);
