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
export async function isElectionClosed(): Promise<boolean> {
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

    // Get all positions to validate form data
    const { data: positions } = await supabase
        .from("positions")
        .select("id")
        .order("display_order");

    if (!positions || positions.length === 0) {
        return { error: "No positions available for voting." };
    }

    // Collect votes from form data (positions are optional)
    const votesToSubmit: { position_id: string; candidate_id: string }[] = [];

    for (const position of positions) {
        const candidateId = formData.get(`position_${position.id}`)?.toString();
        if (candidateId) {
            votesToSubmit.push({
                position_id: position.id,
                candidate_id: candidateId,
            });
        }
    }

    if (votesToSubmit.length === 0) {
        return { error: "Please select at least one candidate before submitting." };
    }

    // Atomic transaction via RPC — all-or-nothing
    const { data, error } = await supabase.rpc("submit_votes_atomic", {
        p_voter_matric: matricNumber,
        p_votes: votesToSubmit,
    });

    if (error) {
        console.error("Vote RPC error:", error);
        if (error.message?.includes("already voted")) {
            return { error: "You have already voted." };
        }
        return { error: `Failed to submit votes. (${error.message})` };
    }

    // Check the RPC response
    const result = data as { success: boolean; error?: string };
    if (!result.success) {
        return { error: result.error || "Failed to submit votes." };
    }

    redirect("/vote/success");
}
