import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VoteDashboard } from "./vote-dashboard";

export default async function VotePage() {
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

  return <VoteDashboard voterName={voterName} positions={positions || []} />;
}
