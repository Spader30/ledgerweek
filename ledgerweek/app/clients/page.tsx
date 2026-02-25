"use client";
import { AppShell } from "@/components/app/app-shell";
import { ClientComposer, ClientTable, TouchComposer, TouchTable } from "@/components/app/forms";
import { useLedgerStore } from "@/store/useLedgerStore";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ClientsPage() {
  const profile = useLedgerStore((s) => s.profile);
  return (
    <AppShell>
      {!profile ? (
        <Card>
          <div className="text-lg font-semibold">Finish setup</div>
          <p className="mt-2 text-white/70">Complete onboarding first.</p>
          <Link href="/onboarding" className="mt-4 inline-block"><Button>Go to onboarding</Button></Link>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <ClientComposer />
          <TouchComposer />
          <div className="lg:col-span-2 grid gap-4 lg:grid-cols-2">
            <ClientTable />
            <TouchTable />
          </div>
        </div>
      )}
    </AppShell>
  );
}
