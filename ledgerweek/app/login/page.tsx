"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { setSession, getSessionClient } from "@/lib/auth";
import { useLedgerStore } from "@/store/useLedgerStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const seedDemo = useLedgerStore((s) => s.seedDemo);
  const profile = useLedgerStore((s) => s.profile);

  const [name, setName] = useState("Jared");
  const [email, setEmail] = useState("you@example.com");

  useEffect(() => {
    const s = getSessionClient();
    if (s) router.replace(profile ? "/dashboard" : "/onboarding");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-8">
          <Badge>LedgerWeek</Badge>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Log in</h1>
          <p className="mt-3 text-white/70">
            This MVP uses mock auth (cookie + localStorage).
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="text-lg font-semibold">Sign in</div>
            <p className="mt-1 text-sm text-white/60">Takes 10 seconds.</p>

            <div className="mt-6 space-y-3">
              <div>
                <label className="text-sm text-white/80">Name</label>
                <Input className="mt-2" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-white/80">Email</label>
                <Input className="mt-2" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setSession({ name, email });
                  router.push(profile ? "/dashboard" : "/onboarding");
                }}
              >
                Continue
              </Button>

              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => {
                  seedDemo();
                  setSession({ name: "Demo User", email: "demo@ledgerweek.app" });
                  router.push("/dashboard");
                }}
              >
                Load demo data
              </Button>
            </div>

            <p className="mt-4 text-xs text-white/50">
              Demo mode seeds clients, deliverables, invoices, and a warning Week Card.
            </p>
          </Card>

          <Card>
            <div className="text-lg font-semibold">What happens next</div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div>1) Onboarding sets your weekly targets</div>
              <div>2) Dashboard shows your Revenue Risk Score</div>
              <div>3) Weekly Reset creates a Week Card archive</div>
            </div>

            <div className="mt-6 text-sm text-white/60">
              Want to see pricing first?{" "}
              <Link href="/pricing" className="text-white/80 hover:text-white underline">
                View pricing
              </Link>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
