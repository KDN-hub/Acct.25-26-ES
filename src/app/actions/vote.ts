"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface VoteState {
    error?: string;
    success?: boolean;
}

// Election closes at 4:00 PM WAT (UTC+1) on Sunday, March 29, 2026
const ELECTION_DEADLINE = new Date("2026-03-29T16:00:00+01:00");

// 60-minute grace period for voters who were mid-session at 4pm (hard cutoff at 5pm)
const SUBMISSION_GRACE_MS = 60 * 60 * 1000;
const SUBMISSION_HARD_DEADLINE = new Date(ELECTION_DEADLINE.getTime() + SUBMISSION_GRACE_MS);

// Used by page.tsx to block NEW visitors after 4pm
export function isElectionClosed(): boolean {
    return new Date() >= ELECTION_DEADLINE;
}

export async function submitVotes(
    _prevState: VoteState,
    formData: FormData
): Promise<VoteState> {
    // Hard deadline: no submissions at all after 4:30 PM (grace period for mid-session voters)
    if (new Date() >= SUBMISSION_HARD_DEADLINE) {
        return { error: "Voting has ended. The election portal closed at 4:00 PM on Sunday, March 29." };
    }

    const cookieStore = await cookies();
    const matricNumber = cookieStore.get("matric_number")?.value;

    if (!matricNumber) {
        redirect("/login");
    }

    const supabase = await createClient();

    // Verify voter hasn't already voted
    const { data: voter } = await supabase
        .from("voters")
        .select("has_voted")
        .eq("matric_number", matricNumber)
        .single();

    if (!voter) {
        redirect("/login");
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

    // Collect votes from form data (positions are optional)
    const votesToInsert: { voter_matric: string; position_id: string; candidate_id: string }[] = [];

    for (const position of positions) {
        const candidateId = formData.get(`position_${position.id}`)?.toString();
        if (candidateId) {
            votesToInsert.push({
                voter_matric: matricNumber,
                position_id: position.id,
                candidate_id: candidateId,
            });
        }
    }

    if (votesToInsert.length === 0) {
        return { error: "Please select at least one candidate before submitting." };
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
