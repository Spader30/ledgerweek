"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { usePathname } from "next/navigation";
const tabs=[{href:"/dashboard",label:"Dashboard"},{href:"/clients",label:"Clients"},{href:"/deliverables",label:"Deliverables"},{href:"/invoices",label:"Invoices"},{href:"/history",label:"Week Cards"}];
export function AppShell({children}:{children:React.ReactNode}){
  const pathname=usePathname();
  return (
    <>
      <Navbar/>
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {tabs.map(t=>{
            const active=pathname===t.href;
            return (
              <Link key={t.href} href={t.href}
                className={"rounded-full px-4 py-2 text-sm border transition "+(active?"border-white/20 bg-white/10 text-white":"border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10")}>
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <Footer/>
    </>
  );
}
