import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PricingCards from "@/components/marketing/pricing-cards";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10">
          <Badge>Pricing</Badge>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Charge for outcomes.</h1>
          <p className="mt-3 text-white/70">LedgerWeek is priced against revenue risk, not against to-do lists.</p>
        </div>
        <PricingCards />
      </main>
      <Footer />
    </>
  );
}
