import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <Badge>Terms</Badge>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Terms of Service (MVP)</h1>
        <p className="mt-4 text-white/70">
          LedgerWeek is provided as-is. This MVP is an operational planning tool and does not provide legal,
          financial, or accounting advice.
        </p>
      </main>
      <Footer />
    </>
  );
}
