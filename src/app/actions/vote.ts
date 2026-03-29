"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface VoteState {
    error?: string;
    success?: boolean;
}

// Used by page.tsx to block NEW visitors
export async function isElectionClosed(): Promise<boolean> {
    const supabase = await createClient();
    const { data } = await supabase
        .from("election_settings")
        .select("status")
        .limit(1)
        .single();
    
    return data?.status === "Ended";
}

export async function submitVotes(
    _prevState: VoteState,
    formData: FormData
): Promise<VoteState> {
    const isClosed = await isElectionClosed();
    
    if (isClosed) {
        return { error: "Voting has ended. The election portal is now closed." };
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
