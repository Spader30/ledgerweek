import { NextResponse } from "next/server";
import { computeRevenueRiskScore } from "@/lib/score";

export async function POST(req: Request) {
  const body = await req.json();
  const profile = body?.profile;
  const clients = body?.clients ?? [];
  const deliverables = body?.deliverables ?? [];
  const invoices = body?.invoices ?? [];
  const touches = body?.touches ?? [];

  if (!profile) return NextResponse.json({ error: "missing_profile" }, { status: 400 });

  const score = computeRevenueRiskScore({ profile, clients, deliverables, invoices, touches });
  return NextResponse.json(score);
}
