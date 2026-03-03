"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface VoteState {
    error?: string;
    success?: boolean;
}

export async function submitVotes(
    _prevState: VoteState,
    formData: FormData
): Promise<VoteState> {
    const cookieStore = await cookies();
    const matricNumber = cookieStore.get("matric_number")?.value;

    if (!matricNumber) {
        redirect("/");
    }

    const supabase = await createClient();

    // Verify voter hasn't already voted
    const { data: voter } = await supabase
        .from("voters")
        .select("has_voted")
        .eq("matric_number", matricNumber)
        .single();

    if (!voter) {
        redirect("/");
    }

    if (voter.has_voted) {
        return { error: "You have already voted." };
    }

    // Get all positions to validate
    const { data: positions } = await supabase
        .from("positions")
        .select("id")
        .order("display_order");

    if (!positions || positions.length === 0) {
        return { error: "No positions available for voting." };
    }

    // Collect votes from form data
    const votesToInsert: { voter_matric: string; position_id: string; candidate_id: string }[] = [];

    for (const position of positions) {
        const candidateId = formData.get(`position_${position.id}`)?.toString();
        if (!candidateId) {
            return { error: "Please select a candidate for every position." };
        }
        votesToInsert.push({
            voter_matric: matricNumber,
            position_id: position.id,
            candidate_id: candidateId,
        });
    }

    // Insert all votes
    const { error: voteError } = await supabase
        .from("votes")
        .insert(votesToInsert);

    if (voteError) {
        console.log("Vote insert error:", voteError);
        if (voteError.code === "23505") {
            return { error: "You have already voted." };
        }
        return { error: `Failed to submit votes. (${voteError.message})` };
    }

    // Mark voter as has_voted
    await supabase
        .from("voters")
        .update({ has_voted: true, voted_at: new Date().toISOString() })
        .eq("matric_number", matricNumber);

    redirect("/vote/success");
}
