import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <Badge>Privacy</Badge>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Privacy Policy (MVP)</h1>
        <p className="mt-4 text-white/70">
          LedgerWeek stores your data in your browser (localStorage) for this MVP demo. No data is sent
          to a server unless you add integrations later.
        </p>
      </main>
      <Footer />
    </>
  );
}
