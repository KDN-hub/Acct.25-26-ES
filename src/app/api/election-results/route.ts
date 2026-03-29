import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const supabase = await createClient();

    // Fetch positions with candidates
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

    // Fetch all votes
    const { data: votes } = await supabase.from("votes").select("position_id, candidate_id");

    // Fetch voter stats
    const { count: totalVoters } = await supabase
        .from("voters")
        .select("*", { count: "exact", head: true });

    const { count: votedCount } = await supabase
        .from("voters")
        .select("*", { count: "exact", head: true })
        .eq("has_voted", true);

    // Fetch election status
    const { data: settingsRow } = await supabase
        .from("election_settings")
        .select("status")
        .limit(1)
        .single();

    // Build results
    const results = (positions || []).map((position) => {
        const positionVotes = (votes || []).filter((v) => v.position_id === position.id);
        const candidateResults = (position.candidates as { id: string; name: string; image_url: string | null }[]).map((candidate) => ({
            ...candidate,
            vote_count: positionVotes.filter((v) => v.candidate_id === candidate.id).length,
        }));
        candidateResults.sort((a, b) => b.vote_count - a.vote_count);
        return {
            ...position,
            candidates: candidateResults,
            totalVotes: positionVotes.length,
        };
    });

    const tv = totalVoters || 0;
    const vc = votedCount || 0;

    return NextResponse.json({
        results,
        totalVoters: tv,
        votedCount: vc,
        participation: tv ? Math.round((vc / tv) * 100) : 0,
        electionStatus: settingsRow?.status || "Ongoing",
    }, {
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
        },
    });
}
