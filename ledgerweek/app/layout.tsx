import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LedgerWeek — Control your week. Protect your income.",
  description: "Weekly operating system for wedding & event vendors: deliverables, pipeline, invoices — measured by a Revenue Risk Score.",
  metadataBase: new URL("https://ledgerweek.example"),
  openGraph: {
    title: "LedgerWeek",
    description: "Reduce revenue risk weeks with delivery + pipeline + invoice discipline.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#070A12] text-white antialiased">{children}</body>
    </html>
  );
}
