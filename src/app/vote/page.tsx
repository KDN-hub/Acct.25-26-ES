import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BallotForm } from "./ballot-form";

export default async function VotePage() {
  // Check authentication via cookie
  const cookieStore = await cookies();
  const matricNumber = cookieStore.get("matric_number")?.value;
  const voterName = cookieStore.get("voter_name")?.value || "Voter";

  if (!matricNumber) {
    redirect("/");
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
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d4a843]/20 bg-[#d4a843]/10 px-4 py-1.5 text-xs font-medium text-[#d4a843]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d4a843] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4a843]" />
            </span>
            Voting is Live
          </div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Hello, <span className="text-[#d4a843]">{voterName}</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Select one candidate for each position, then submit your ballot.
          </p>
        </div>

        <BallotForm positions={positions || []} />
      </div>
    </div>
  );
}
