"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLedgerStore } from "@/store/useLedgerStore";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  businessName: z.string().min(2),
  role: z.enum(["photographer", "videographer", "planner", "designer", "other"]),
  weeklyBillableTargetHours: z.coerce.number().min(1).max(80),
  weeklyPipelineTarget: z.coerce.number().min(0).max(50),
  invoiceGraceDays: z.coerce.number().min(0).max(60),
  weeklyBillableHoursPlanned: z.coerce.number().min(0).max(80),
});

type Values = z.infer<typeof schema>;

export default function OnboardingPage() {
  const router = useRouter();
  const setProfile = useLedgerStore((s) => s.setProfile);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessName: "The Moment Recorded",
      role: "photographer",
      weeklyBillableTargetHours: 10,
      weeklyPipelineTarget: 3,
      invoiceGraceDays: 7,
      weeklyBillableHoursPlanned: 8,
    },
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-8">
          <Badge>Setup</Badge>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Onboarding</h1>
          <p className="mt-3 text-white/70">
            Configure weekly targets so LedgerWeek can compute your Revenue Risk Score.
          </p>
        </div>

        <Card>
          <div className="text-lg font-semibold">Your operating targets</div>
          <p className="mt-1 text-sm text-white/60">You can change these later.</p>

          <form
            className="mt-6 grid gap-3 md:grid-cols-2"
            onSubmit={form.handleSubmit((v) => {
              setProfile({
                niche: "wedding_vendor",
                businessName: v.businessName,
                role: v.role,
                weeklyBillableTargetHours: v.weeklyBillableTargetHours,
                weeklyPipelineTarget: v.weeklyPipelineTarget,
                invoiceGraceDays: v.invoiceGraceDays,
                weeklyBillableHoursPlanned: v.weeklyBillableHoursPlanned,
              });
              router.push("/dashboard");
            })}
          >
            <div className="md:col-span-2">
              <label className="text-sm text-white/80">Business name</label>
              <Input className="mt-2" {...form.register("businessName")} />
            </div>

            <div>
              <label className="text-sm text-white/80">Role</label>
              <select
                className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 text-sm"
                {...form.register("role")}
              >
                <option value="photographer">Photographer</option>
                <option value="videographer">Videographer</option>
                <option value="planner">Planner</option>
                <option value="designer">Designer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-white/80">Invoice grace days</label>
              <Input className="mt-2" type="number" min={0} max={60} step={1} {...form.register("invoiceGraceDays")} />
              <p className="mt-2 text-xs text-white/50">Invoices are “overdue” after this many days past due date.</p>
            </div>

            <div>
              <label className="text-sm text-white/80">Weekly billable target (hours)</label>
              <Input className="mt-2" type="number" min={1} max={80} step={0.5} {...form.register("weeklyBillableTargetHours")} />
            </div>

            <div>
              <label className="text-sm text-white/80">Billable hours planned (this week)</label>
              <Input className="mt-2" type="number" min={0} max={80} step={0.5} {...form.register("weeklyBillableHoursPlanned")} />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-white/80">Weekly pipeline minimum (touches)</label>
              <Input className="mt-2" type="number" min={0} max={50} step={1} {...form.register("weeklyPipelineTarget")} />
              <p className="mt-2 text-xs text-white/50">Touches are quick actions: follow-ups, inquiries, referral asks.</p>
            </div>

            <div className="md:col-span-2 mt-2 flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={() => router.push("/dashboard")}>
                Skip for now
              </Button>
              <Button type="submit">Finish setup</Button>
            </div>
          </form>
        </Card>
      </main>
      <Footer />
    </>
  );
}
