"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLedgerStore } from "@/store/useLedgerStore";
import { formatShort } from "@/lib/dates";

const clientSchema = z.object({
  name: z.string().min(2),
  status: z.enum(["lead", "booked", "delivering", "delivered", "archived"]),
  eventDateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  contractValue: z.coerce.number().min(0),
  notes: z.string().optional().default(""),
});
type ClientValues = z.infer<typeof clientSchema>;

export function ClientComposer() {
  const addClient = useLedgerStore((s) => s.addClient);
  const form = useForm<ClientValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "New Client",
      status: "lead",
      eventDateISO: new Date().toISOString().slice(0, 10),
      contractValue: 2500,
      notes: "",
    },
  });

  return (
    <Card>
      <div className="text-lg font-semibold">Add client</div>
      <div className="mt-1 text-sm text-white/60">Minimal: name, date, value, status.</div>

      <form
        className="mt-6 grid gap-3 md:grid-cols-2"
        onSubmit={form.handleSubmit((v) => {
          addClient({ ...v, notes: v.notes ?? "" });
          form.reset({ ...v, name: "New Client" });
        })}
      >
        <div className="md:col-span-2">
          <label className="text-sm text-white/80">Client name</label>
          <Input className="mt-2" {...form.register("name")} />
        </div>

        <div>
          <label className="text-sm text-white/80">Status</label>
          <select className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 text-sm" {...form.register("status")}>
            <option value="lead">Lead</option>
            <option value="booked">Booked</option>
            <option value="delivering">Delivering</option>
            <option value="delivered">Delivered</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-white/80">Event date</label>
          <Input className="mt-2" type="date" {...form.register("eventDateISO")} />
        </div>

        <div>
          <label className="text-sm text-white/80">Contract value</label>
          <Input className="mt-2" type="number" min={0} step={50} {...form.register("contractValue")} />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-white/80">Notes</label>
          <Textarea className="mt-2" {...form.register("notes")} />
        </div>

        <div className="md:col-span-2 flex items-center justify-end">
          <Button type="submit">Add client</Button>
        </div>
      </form>
    </Card>
  );
}

const touchSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(["inquiry", "follow_up", "referral_ask"]),
  who: z.string().min(2),
  valueHint: z.coerce.number().min(0),
  notes: z.string().optional().default(""),
});
type TouchValues = z.infer<typeof touchSchema>;

export function TouchComposer() {
  const addTouch = useLedgerStore((s) => s.addTouch);
  const form = useForm<TouchValues>({
    resolver: zodResolver(touchSchema),
    defaultValues: { date: new Date().toISOString().slice(0, 10), type: "follow_up", who: "Prospect", valueHint: 1000, notes: "" },
  });

  return (
    <Card>
      <div className="text-lg font-semibold">Log pipeline touch</div>
      <div className="mt-1 text-sm text-white/60">Small actions prevent revenue gaps.</div>

      <form
        className="mt-6 grid gap-3 md:grid-cols-2"
        onSubmit={form.handleSubmit((v) => {
          addTouch({ ...v, notes: v.notes ?? "" });
          form.reset({ ...v, who: "Prospect" });
        })}
      >
        <div>
          <label className="text-sm text-white/80">Date</label>
          <Input className="mt-2" type="date" {...form.register("date")} />
        </div>

        <div>
          <label className="text-sm text-white/80">Type</label>
          <select className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 text-sm" {...form.register("type")}>
            <option value="follow_up">Follow-up</option>
            <option value="inquiry">Inquiry</option>
            <option value="referral_ask">Referral ask</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-white/80">Who</label>
          <Input className="mt-2" {...form.register("who")} />
        </div>

        <div>
          <label className="text-sm text-white/80">Value hint ($)</label>
          <Input className="mt-2" type="number" min={0} step={50} {...form.register("valueHint")} />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-white/80">Notes</label>
          <Textarea className="mt-2" {...form.register("notes")} />
        </div>

        <div className="md:col-span-2 flex items-center justify-end">
          <Button type="submit">Log touch</Button>
        </div>
      </form>
    </Card>
  );
}

const deliverableSchema = z.object({
  clientId: z.string().min(1),
  title: z.string().min(2),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  completionPercent: z.coerce.number().min(0).max(100),
  estimatedHours: z.coerce.number().min(0).max(500),
});
type DeliverableValues = z.infer<typeof deliverableSchema>;

export function DeliverableComposer() {
  const clients = useLedgerStore((s) => s.clients);
  const addDeliverable = useLedgerStore((s) => s.addDeliverable);
  const form = useForm<DeliverableValues>({
    resolver: zodResolver(deliverableSchema),
    defaultValues: {
      clientId: clients[0]?.id ?? "",
      title: "New Deliverable",
      dueDate: new Date().toISOString().slice(0, 10),
      completionPercent: 0,
      estimatedHours: 4,
    },
  });

  return (
    <Card>
      <div className="text-lg font-semibold">Add deliverable</div>
      <div className="mt-1 text-sm text-white/60">Track deadlines + completion.</div>

      <form
        className="mt-6 grid gap-3 md:grid-cols-2"
        onSubmit={form.handleSubmit((v) => {
          addDeliverable(v);
          form.reset({ ...v, title: "New Deliverable", completionPercent: 0 });
        })}
      >
        <div className="md:col-span-2">
          <label className="text-sm text-white/80">Client</label>
          <select className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 text-sm" {...form.register("clientId")}>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {clients.length === 0 && <p className="mt-2 text-xs text-amber-200/90">Add a client first.</p>}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-white/80">Title</label>
          <Input className="mt-2" {...form.register("title")} />
        </div>

        <div>
          <label className="text-sm text-white/80">Due date</label>
          <Input className="mt-2" type="date" {...form.register("dueDate")} />
        </div>

        <div>
          <label className="text-sm text-white/80">Completion %</label>
          <Input className="mt-2" type="number" min={0} max={100} step={5} {...form.register("completionPercent")} />
        </div>

        <div>
          <label className="text-sm text-white/80">Estimated hours</label>
          <Input className="mt-2" type="number" min={0} step={0.5} {...form.register("estimatedHours")} />
        </div>

        <div className="md:col-span-2 flex items-center justify-end">
          <Button type="submit" disabled={clients.length === 0}>Add deliverable</Button>
        </div>
      </form>
    </Card>
  );
}

const invoiceSchema = z.object({
  clientId: z.string().min(1),
  title: z.string().min(2),
  amount: z.coerce.number().min(0),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
type InvoiceValues = z.infer<typeof invoiceSchema>;

export function InvoiceComposer() {
  const clients = useLedgerStore((s) => s.clients);
  const addInvoice = useLedgerStore((s) => s.addInvoice);
  const form = useForm<InvoiceValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: clients[0]?.id ?? "",
      title: "Invoice",
      amount: 1000,
      dueDate: new Date().toISOString().slice(0, 10),
    },
  });

  return (
    <Card>
      <div className="text-lg font-semibold">Add invoice</div>
      <div className="mt-1 text-sm text-white/60">Track due + paid.</div>

      <form
        className="mt-6 grid gap-3 md:grid-cols-2"
        onSubmit={form.handleSubmit((v) => {
          addInvoice({ ...v, paid: false, paidDate: null });
          form.reset({ ...v, title: "Invoice" });
        })}
      >
        <div className="md:col-span-2">
          <label className="text-sm text-white/80">Client</label>
          <select className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 text-sm" {...form.register("clientId")}>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {clients.length === 0 && <p className="mt-2 text-xs text-amber-200/90">Add a client first.</p>}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-white/80">Title</label>
          <Input className="mt-2" {...form.register("title")} />
        </div>

        <div>
          <label className="text-sm text-white/80">Amount</label>
          <Input className="mt-2" type="number" min={0} step={10} {...form.register("amount")} />
        </div>

        <div>
          <label className="text-sm text-white/80">Due date</label>
          <Input className="mt-2" type="date" {...form.register("dueDate")} />
        </div>

        <div className="md:col-span-2 flex items-center justify-end">
          <Button type="submit" disabled={clients.length === 0}>Add invoice</Button>
        </div>
      </form>
    </Card>
  );
}

export function ClientTable() {
  const clients = useLedgerStore((s) => s.clients);
  const updateClient = useLedgerStore((s) => s.updateClient);
  const removeClient = useLedgerStore((s) => s.removeClient);

  return (
    <Card>
      <div className="text-lg font-semibold">Clients</div>
      <div className="mt-4 space-y-2">
        {clients.length === 0 ? (
          <div className="text-sm text-white/50">No clients yet.</div>
        ) : (
          clients.map((c) => (
            <div key={c.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{c.name}</div>
                    <Badge tone={c.status === "lead" ? "warn" : c.status === "archived" ? "neutral" : "good"}>{c.status}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-white/60">Event {formatShort(c.eventDateISO)} • ${c.contractValue.toFixed(0)}</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <select className="h-10 rounded-xl border border-white/10 bg-[#0B1020] px-3 text-sm" value={c.status} onChange={(e) => updateClient(c.id, { status: e.target.value as any })}>
                    <option value="lead">Lead</option>
                    <option value="booked">Booked</option>
                    <option value="delivering">Delivering</option>
                    <option value="delivered">Delivered</option>
                    <option value="archived">Archived</option>
                  </select>
                  <Button variant="danger" onClick={() => removeClient(c.id)}>Remove</Button>
                </div>
              </div>

              {c.notes && <div className="mt-3 text-sm text-white/70">{c.notes}</div>}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export function TouchTable() {
  const touches = useLedgerStore((s) => s.touches);
  const removeTouch = useLedgerStore((s) => s.removeTouch);

  return (
    <Card>
      <div className="text-lg font-semibold">Pipeline touches</div>
      <div className="mt-4 space-y-2">
        {touches.length === 0 ? (
          <div className="text-sm text-white/50">No touches yet.</div>
        ) : (
          touches
            .slice()
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((t) => (
              <div key={t.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{t.who}</div>
                  <Badge tone="neutral">${t.valueHint.toFixed(0)}</Badge>
                </div>
                <div className="mt-1 text-xs text-white/60">{t.type.replace("_", " ")} • {formatShort(t.date)}</div>
                {t.notes && <div className="mt-2 text-sm text-white/70">{t.notes}</div>}
                <div className="mt-3">
                  <Button variant="danger" onClick={() => removeTouch(t.id)}>Remove</Button>
                </div>
              </div>
            ))
        )}
      </div>
    </Card>
  );
}

export function DeliverableTable() {
  const deliverables = useLedgerStore((s) => s.deliverables);
  const clients = useLedgerStore((s) => s.clients);
  const updateDeliverable = useLedgerStore((s) => s.updateDeliverable);
  const removeDeliverable = useLedgerStore((s) => s.removeDeliverable);

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? "Client";

  return (
    <Card>
      <div className="text-lg font-semibold">Deliverables</div>
      <div className="mt-4 space-y-2">
        {deliverables.length === 0 ? (
          <div className="text-sm text-white/50">No deliverables yet.</div>
        ) : (
          deliverables.map((d) => (
            <div key={d.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium">{d.title}</div>
                  <div className="mt-1 text-xs text-white/60">{clientName(d.clientId)} • Due {formatShort(d.dueDate)} • {d.estimatedHours}h est</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Input className="w-24" type="number" min={0} max={100} step={5} value={d.completionPercent} onChange={(e) => updateDeliverable(d.id, { completionPercent: Number(e.target.value) })} />
                  <Badge tone={d.completionPercent < 50 ? "warn" : "good"}>{d.completionPercent}%</Badge>
                  <Button variant="danger" onClick={() => removeDeliverable(d.id)}>Remove</Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export function InvoiceTable() {
  const invoices = useLedgerStore((s) => s.invoices);
  const clients = useLedgerStore((s) => s.clients);
  const updateInvoice = useLedgerStore((s) => s.updateInvoice);
  const removeInvoice = useLedgerStore((s) => s.removeInvoice);

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? "Client";

  return (
    <Card>
      <div className="text-lg font-semibold">Invoices</div>
      <div className="mt-4 space-y-2">
        {invoices.length === 0 ? (
          <div className="text-sm text-white/50">No invoices yet.</div>
        ) : (
          invoices.map((i) => (
            <div key={i.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium">{i.title}</div>
                  <div className="mt-1 text-xs text-white/60">{clientName(i.clientId)} • Due {formatShort(i.dueDate)}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={i.paid ? "good" : "risk"}>${i.amount.toFixed(0)}</Badge>
                  <Button
                    variant={i.paid ? "secondary" : "primary"}
                    onClick={() => updateInvoice(i.id, { paid: !i.paid, paidDate: !i.paid ? new Date().toISOString().slice(0, 10) : null })}
                  >
                    {i.paid ? "Mark unpaid" : "Mark paid"}
                  </Button>
                  <Button variant="danger" onClick={() => removeInvoice(i.id)}>Remove</Button>
                </div>
              </div>
              {i.paidDate && <div className="mt-2 text-xs text-white/60">Paid {formatShort(i.paidDate)}</div>}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
