"use client";

import { useActionState, useEffect, useRef } from "react";
import { loginAdmin, type AdminAuthState } from "@/app/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const initialState: AdminAuthState = {};

export default function AdminLoginPage() {
    const [state, formAction, isPending] = useActionState(
        loginAdmin,
        initialState
    );
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus the PIN input on load
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
            {/* ── Animated background ── */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f1f3d] to-[#0a1628]" />
                <div className="absolute -left-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[#d4a843]/8 blur-[120px] animate-pulse" />
                <div className="absolute -right-32 bottom-1/4 h-[25rem] w-[25rem] rounded-full bg-blue-500/5 blur-[100px] animate-pulse [animation-delay:2s]" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(212,168,67,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,0.3) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="flex w-full max-w-sm flex-col items-center gap-8">
                {/* ── Header ── */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="relative">
                        <div className="absolute -inset-3 rounded-full bg-[#d4a843]/10 blur-xl" />
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#d4a843]/30 bg-gradient-to-br from-[#1a2d52] to-[#0f1f3d] shadow-2xl shadow-[#d4a843]/10">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            Admin <span className="text-[#d4a843]">Access</span>
                        </h1>
                        <p className="mt-1 text-sm text-white/50">
                            Enter the admin passcode to view live results
                        </p>
                    </div>
                </div>

                {/* ── Login card ── */}
                <div className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.04] p-8 shadow-2xl shadow-black/40 backdrop-blur-md">
                    <form action={formAction} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <Input
                                ref={inputRef}
                                id="pin"
                                name="pin"
                                autoFocus
                                type="password"
                                placeholder="Enter passcode"
                                required
                                autoComplete="off"
                                className="h-14 text-center text-xl tracking-widest rounded-xl border-white/10 bg-white/[0.06] font-mono text-white placeholder:text-white/20 focus-visible:border-[#d4a843]/50 focus-visible:ring-[#d4a843]/20"
                            />
                        </div>

                        {/* Error message */}
                        {state.error && (
                            <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
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
                            className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-[#d4a843] to-[#c49535] font-semibold text-[#0a1628] shadow-lg shadow-[#d4a843]/20 transition-all hover:from-[#e0b84e] hover:to-[#d4a843] hover:shadow-xl hover:shadow-[#d4a843]/30 active:scale-[0.98]"
                        >
                            {isPending ? "Verifying…" : "Unlock Dashboard"}
                        </Button>
                    </form>
                </div>

                <Link href="/" className="text-sm font-medium text-white/40 hover:text-white transition-colors">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
