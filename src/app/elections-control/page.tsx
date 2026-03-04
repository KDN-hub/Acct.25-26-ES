import { createClient } from "@/lib/supabase/server";

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
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                    Election <span className="text-[#d4a843]">Results</span>
                </h1>
                <p className="mt-1.5 text-sm text-white/40">
                    Live results for the Accounting Department election
                </p>
            </div>

            {/* Stats bar */}
            <div className="mb-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-sm">
                    <p className="text-xs font-medium uppercase tracking-wider text-white/40">Total Voters</p>
                    <p className="mt-1 text-2xl font-bold text-white">{totalVoters || 0}</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-sm">
                    <p className="text-xs font-medium uppercase tracking-wider text-white/40">Votes Cast</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-400">{votedCount || 0}</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-sm">
                    <p className="text-xs font-medium uppercase tracking-wider text-white/40">Participation</p>
                    <p className="mt-1 text-2xl font-bold text-[#d4a843]">{participation}%</p>
                </div>
            </div>

            {/* Results grid */}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {results.map((position) => {
                    const maxVotes = Math.max(...position.candidates.map((c) => c.vote_count), 1);

                    return (
                        <div
                            key={position.id}
                            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white">{position.name}</h2>
                                <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-white/40">
                                    {position.totalVotes} vote{position.totalVotes !== 1 ? "s" : ""}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {position.candidates.map((candidate, index) => {
                                    const percentage = position.totalVotes
                                        ? Math.round((candidate.vote_count / position.totalVotes) * 100)
                                        : 0;
                                    const isLeading = index === 0 && candidate.vote_count > 0;

                                    return (
                                        <div key={candidate.id} className="relative">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2.5">
                                                    {/* Candidate avatar */}
                                                    <div
                                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${isLeading
                                                                ? "bg-[#d4a843]/20 text-[#d4a843]"
                                                                : "bg-white/10 text-white/50"
                                                            }`}
                                                    >
                                                        {candidate.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .slice(0, 2)}
                                                    </div>
                                                    <span className={`text-sm font-medium ${isLeading ? "text-white" : "text-white/70"}`}>
                                                        {candidate.name}
                                                    </span>
                                                    {isLeading && (
                                                        <span className="rounded-full bg-[#d4a843]/15 px-2 py-0.5 text-[10px] font-semibold text-[#d4a843]">
                                                            Leading
                                                        </span>
                                                    )}
                                                </div>
                                                <span className={`text-sm font-semibold ${isLeading ? "text-[#d4a843]" : "text-white/50"}`}>
                                                    {candidate.vote_count} ({percentage}%)
                                                </span>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${isLeading
                                                            ? "bg-gradient-to-r from-[#d4a843] to-[#e0b84e]"
                                                            : "bg-white/15"
                                                        }`}
                                                    style={{
                                                        width: `${(candidate.vote_count / maxVotes) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
