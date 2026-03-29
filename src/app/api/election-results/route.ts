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

    // Fetch ALL votes — Supabase defaults to 1000 rows, so we paginate
    let allVotes: { position_id: string; candidate_id: string }[] = [];
    let from = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
        const { data: votePage } = await supabase
            .from("votes")
            .select("position_id, candidate_id")
            .range(from, from + pageSize - 1);

        if (votePage && votePage.length > 0) {
            allVotes = allVotes.concat(votePage);
            from += pageSize;
            hasMore = votePage.length === pageSize;
        } else {
            hasMore = false;
        }
    }

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
        const positionVotes = allVotes.filter((v) => v.position_id === position.id);
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
        totalVoteRecords: allVotes.length,
    }, {
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
        },
    });
}
