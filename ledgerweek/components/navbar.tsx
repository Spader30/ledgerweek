"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { clearSession, getSessionClient } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => setSignedIn(!!getSessionClient()), []);
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-[#070A12]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-white/10" />
          <span className="font-semibold tracking-tight">LedgerWeek</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <Link className="text-sm text-white/70 hover:text-white" href="/how-it-works">How it works</Link>
          <Link className="text-sm text-white/70 hover:text-white" href="/pricing">Pricing</Link>
          <Link className="text-sm text-white/70 hover:text-white" href="/dashboard">App</Link>
        </div>
        <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}}>
          {signedIn ? (
            <Button variant="secondary" onClick={()=>{ clearSession(); location.href="/"; }}>Log out</Button>
          ) : (
            <Link href="/login"><Button>Log in</Button></Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}
