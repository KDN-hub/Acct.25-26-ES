"use client";

import { useActionState } from "react";
import { loginWithMatric, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginWithMatric,
    initialState
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* ── Animated background ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f1f3d] to-[#0a1628]" />

        {/* Gold accent glow */}
        <div className="absolute -left-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[#d4a843]/8 blur-[120px] animate-pulse" />
        <div className="absolute -right-32 bottom-1/4 h-[25rem] w-[25rem] rounded-full bg-[#d4a843]/6 blur-[100px] animate-pulse [animation-delay:2s]" />

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

      <div className="flex w-full max-w-sm flex-col items-center gap-10">
        {/* ── Logo / branding ── */}
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Shield icon with gold accent */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-[#d4a843]/10 blur-xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#d4a843]/30 bg-gradient-to-br from-[#1a2d52] to-[#0f1f3d] shadow-2xl shadow-[#d4a843]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d4a843"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10"
              >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              AD <span className="text-[#d4a843]">E-Voting</span>
            </h1>
            <p className="mt-1.5 text-sm font-medium tracking-wide text-white/50">
              Accounting Department Electoral System
            </p>
          </div>
        </div>

        {/* ── Login card ── */}
        <div className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.04] p-8 shadow-2xl shadow-black/40 backdrop-blur-md">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Voter Authentication
            </h2>
            <p className="mt-1 text-sm text-white/40">
              Enter your details to access the ballot.
            </p>
          </div>

          <form action={formAction} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. John Doe"
                required
                autoComplete="off"
                autoFocus
                className="h-12 rounded-xl border-white/10 bg-white/[0.06] text-white placeholder:text-white/25 focus-visible:border-[#d4a843]/50 focus-visible:ring-[#d4a843]/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="matric_number" className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Matric Number
              </Label>
              <Input
                id="matric_number"
                name="matric_number"
                type="text"
                placeholder="e.g. 20/0001"
                required
                autoComplete="off"
                className="h-12 rounded-xl border-white/10 bg-white/[0.06] text-white placeholder:text-white/25 focus-visible:border-[#d4a843]/50 focus-visible:ring-[#d4a843]/20"
              />
            </div>

            {/* Error message */}
            {state.error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                {state.error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="mt-1 h-12 w-full rounded-xl bg-gradient-to-r from-[#d4a843] to-[#c49535] font-semibold text-[#0a1628] shadow-lg shadow-[#d4a843]/20 transition-all hover:from-[#e0b84e] hover:to-[#d4a843] hover:shadow-xl hover:shadow-[#d4a843]/30 active:scale-[0.98]"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Verifying…
                </span>
              ) : (
                "Login to Vote"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-xs text-white/30">
            Your vote is confidential and secured by end-to-end encryption.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-white/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secured Connection
          </div>
        </div>
      </div>
    </div>
  );
}
