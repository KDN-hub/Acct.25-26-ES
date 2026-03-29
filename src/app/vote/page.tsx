import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VoteDashboard } from "./vote-dashboard";
import { isElectionClosed } from "@/app/actions/vote";

// Election deadline: Sunday, March 29, 2026 at 4:00 PM WAT

export default async function VotePage() {
  // Check if election is closed
  const electionClosed = await isElectionClosed();

  if (electionClosed) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f1f3d] to-[#0a1628]" />
          <div className="absolute -left-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[#d4a843]/8 blur-[120px] animate-pulse" />
          <div className="absolute -right-32 bottom-1/4 h-[25rem] w-[25rem] rounded-full bg-[#d4a843]/6 blur-[100px] animate-pulse [animation-delay:2s]" />
        </div>

        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            {/* Lock icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#d4a843]/10 border border-[#d4a843]/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="1.5" className="h-10 w-10">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">
              Voting Has <span className="text-[#d4a843]">Ended</span>
            </h1>

            <p className="text-white/50 text-sm leading-relaxed mb-6">
              The election portal has been officially closed by the electoral committee.
              <br />
              Thank you for your participation in the ALBU Elections 2026.
            </p>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-xs text-white/30">
              Results will be announced by the Electoral Committee.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cookieStore = await cookies();
  const matricNumber = cookieStore.get("matric_number")?.value;
  const voterName = cookieStore.get("voter_name")?.value || "Voter";

  if (!matricNumber) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Check if already voted
  const { data: voter } = await supabase
    .from("voters")
    .select("has_voted")
    .eq("matric_number", matricNumber)
    .single();

  if (voter?.has_voted) {
    redirect("/vote/success");
  }

  // Fetch positions with their candidates
  const { data: positions } = await supabase
    .from("positions")
    .select(`
      id,
      name,
      display_order,
      candidates (
        id,
        name,
        image_url
      )
    `)
    .order("display_order");

  return (
    <VoteDashboard
      voterName={voterName}
      positions={positions || []}
    />
  );
}
