/* ──────────────────────────────────────────────
 * Shared TypeScript types for the Voting App
 * ────────────────────────────────────────────── */

export interface Election {
    id: string;
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    created_at: string;
}

export interface Candidate {
    id: string;
    election_id: string;
    name: string;
    bio?: string;
    image_url?: string;
    created_at: string;
}

export interface Vote {
    id: string;
    election_id: string;
    candidate_id: string;
    voter_id: string;
    created_at: string;
}
