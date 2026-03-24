import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/logout";
import { Button } from "@/components/ui/button";

export default async function VoteSuccessPage() {
    const cookieStore = await cookies();
    const matricNumber = cookieStore.get("matric_number")?.value;
    const voterName = cookieStore.get("voter_name")?.value || "Voter";

    if (!matricNumber) {
        redirect("/login");
    }

    // Get the voted_at timestamp from the database
    const supabase = await createClient();
    const { data: voter } = await supabase
        .from("voters")
        .select("voted_at")
        .eq("matric_number", matricNumber)
        .single();

    const votedAt = voter?.voted_at
        ? new Date(voter.voted_at).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
          })
        : new Date().toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
          });

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
            {/* ── Animated background ── */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f1f3d] to-[#0a1628]" />
                <div className="absolute -left-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[#d4a843]/8 blur-[120px] animate-pulse" />
                <div className="absolute -right-32 bottom-1/4 h-[25rem] w-[25rem] rounded-full bg-[#d4a843]/6 blur-[100px] animate-pulse [animation-delay:2s]" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(212,168,67,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,0.3) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
                {/* ── Success icon ── */}
                <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-emerald-500/15 blur-xl animate-pulse" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-2xl shadow-emerald-500/30">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-10 w-10"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                </div>

                {/* ── Heading ── */}
                <div>
                    <h1 className="text-3xl font-bold text-white sm:text-4xl">
                        Vote Confirmed
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-white/50 sm:text-base">
                        Thank you for participating in the ALBU Election 2026.
                    </p>
                </div>

                {/* ── Verification details card ── */}
                <div className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur-md">
                    <h2 className="mb-5 text-left text-xs font-bold uppercase tracking-widest text-emerald-400">
                        Verification Details
                    </h2>

                    <div className="space-y-0 divide-y divide-white/[0.06]">
                        <div className="flex items-center justify-between py-3.5">
                            <span className="text-sm text-white/40">Voter</span>
                            <span className="text-sm font-semibold text-white">
                                {voterName}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3.5">
                            <span className="text-sm text-white/40">Matric Number</span>
                            <span className="text-sm font-semibold text-white">
                                {matricNumber}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3.5">
                            <span className="text-sm text-white/40">Date &amp; Time</span>
                            <span className="text-sm font-semibold text-white">
                                {votedAt}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Info note ── */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-3">
                    <p className="text-xs text-white/30">
                        Your vote is anonymous and encrypted. You cannot vote again with the same matric number.
                    </p>
                </div>

                {/* ── Logout button ── */}
                <form action={logout}>
                    <Button
                        type="submit"
                        className="h-11 rounded-xl bg-gradient-to-r from-[#d4a843] to-[#c49535] px-10 font-semibold text-[#0a1628] shadow-lg shadow-[#d4a843]/20 hover:from-[#e0b84e] hover:to-[#d4a843] transition-all"
                    >
                        Logout
                    </Button>
                </form>
            </div>
        </div>
    );
}
