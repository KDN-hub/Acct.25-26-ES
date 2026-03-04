"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function SplashPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* ── Animated background ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f1f3d] to-[#0a1628]" />

        {/* Gold accent glows */}
        <div className="absolute -left-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[#d4a843]/8 blur-[120px] animate-pulse" />
        <div className="absolute -right-32 bottom-1/4 h-[25rem] w-[25rem] rounded-full bg-[#d4a843]/6 blur-[100px] animate-pulse [animation-delay:2s]" />
        <div className="absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4a843]/4 blur-[140px] animate-pulse [animation-delay:4s]" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,168,67,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="flex w-full max-w-md flex-col items-center gap-10 text-center">
        {/* ── Logo ── */}
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-[#d4a843]/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-[#d4a843]/20 shadow-2xl shadow-[#d4a843]/15">
            <Image
              src="/logo.png"
              alt="AD E-Voting Logo"
              width={140}
              height={140}
              className="h-[140px] w-[140px] object-cover"
              priority
            />
          </div>
        </div>

        {/* ── Branding ── */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-[#d4a843] to-[#e0b84e] bg-clip-text text-transparent">
              AD E-Voting
            </span>
          </h1>
          <p className="mt-3 text-base font-medium tracking-wide text-white/60 sm:text-lg">
            Accounting Department Electoral System
          </p>
        </div>

        {/* ── Proceed button ── */}
        <Link href="/login" className="w-full max-w-xs">
          <Button
            size="lg"
            className="h-14 w-full rounded-2xl bg-gradient-to-r from-[#d4a843] to-[#c49535] text-base font-semibold text-[#0a1628] shadow-xl shadow-[#d4a843]/25 transition-all hover:from-[#e0b84e] hover:to-[#d4a843] hover:shadow-2xl hover:shadow-[#d4a843]/30 active:scale-[0.98]"
          >
            Proceed to Login
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-2 h-5 w-5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Button>
        </Link>

        {/* ── Footer ── */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-white/25">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secured Electronic Voting
          </div>
        </div>
      </div>
    </div>
  );
}
