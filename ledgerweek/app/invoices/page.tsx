"use client";
import { AppShell } from "@/components/app/app-shell";
import { InvoiceComposer, InvoiceTable } from "@/components/app/forms";
import { useLedgerStore } from "@/store/useLedgerStore";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function InvoicesPage() {
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
          <InvoiceComposer />
          <InvoiceTable />
        </div>
      )}
    </AppShell>
  );
}
