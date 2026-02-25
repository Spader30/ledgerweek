export type Niche = "wedding_vendor";
export type Profile = {
  niche: Niche;
  businessName: string;
  role: "photographer" | "videographer" | "planner" | "designer" | "other";
  weeklyBillableTargetHours: number;
  weeklyPipelineTarget: number;
  invoiceGraceDays: number;
  weeklyBillableHoursPlanned: number;
};
export type ClientStatus = "lead" | "booked" | "delivering" | "delivered" | "archived";
export type Client = {
  id: string;
  name: string;
  status: ClientStatus;
  eventDateISO: string;
  contractValue: number;
  notes: string;
};
export type Deliverable = {
  id: string;
  clientId: string;
  title: string;
  dueDate: string;
  completionPercent: number;
  estimatedHours: number;
};
export type Invoice = {
  id: string;
  clientId: string;
  title: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  paidDate: string | null;
};
export type TouchType = "inquiry" | "follow_up" | "referral_ask";
export type PipelineTouch = {
  id: string;
  date: string;
  type: TouchType;
  who: string;
  valueHint: number;
  notes: string;
};
export type WeekCard = {
  id: string;
  weekStartISO: string;
  createdAtISO: string;
  score: number;
  label: "Stable" | "Warning" | "Risk";
  metrics: {
    pipelineTouches: number;
    billableHoursScheduled: number;
    overdueInvoices: number;
    deliverablesAtRisk: number;
  };
  notes: string;
  actions: string[];
};
