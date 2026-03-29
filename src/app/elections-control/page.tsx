import { createClient } from "@/lib/supabase/server";
import { logoutAdmin } from "@/app/actions/admin-auth";
import AdminDashboardClient from "./admin-dashboard-client";

// Always fetch fresh data, never cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CandidateResult {
    id: string;
    name: string;
    image_url: string | null;
    vote_count: number;
}

interface PositionResult {
    id: string;
    name: string;
    display_order: number;
    candidates: CandidateResult[];
    totalVotes: number;
}

export default async function AdminPage() {
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

    const electionStatus: string = settingsRow?.status || "Ongoing";

    // Build results
    const results: PositionResult[] = (positions || []).map((position) => {
        const positionVotes = (votes || []).filter((v) => v.position_id === position.id);
        const candidateResults: CandidateResult[] = (position.candidates as { id: string; name: string; image_url: string | null }[]).map((candidate) => ({
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

    const participation = totalVoters ? Math.round(((votedCount || 0) / totalVoters) * 100) : 0;

    return (
        <AdminDashboardClient
            results={results}
            totalVoters={totalVoters || 0}
            votedCount={votedCount || 0}
            participation={participation}
            electionStatus={electionStatus}
            logoutAction={logoutAdmin}
        />
    );
}
