"use client";

import { useActionState } from "react";
import { submitVotes, type VoteState } from "@/app/actions/vote";
import { Button } from "@/components/ui/button";

interface Candidate {
    id: string;
    name: string;
    image_url: string | null;
}

interface Position {
    id: string;
    name: string;
    display_order: number;
    candidates: Candidate[];
}

const initialState: VoteState = {};

export function BallotForm({ positions }: { positions: Position[] }) {
    const [state, formAction, isPending] = useActionState(
        submitVotes,
        initialState
    );

    return (
        <form action={formAction} className="flex flex-col gap-6">
            {positions.map((position, index) => (
                <div
                    key={position.id}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-6 backdrop-blur-sm"
                >
                    {/* Position header */}
                    <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d4a843]/15 text-sm font-bold text-[#d4a843]">
                            {index + 1}
                        </span>
                        <h2 className="text-lg font-semibold text-white">
                            {position.name}
                        </h2>
                    </div>

                    {/* Candidates */}
                    <div className="flex flex-col gap-3">
                        {position.candidates.map((candidate) => (
                            <label
                                key={candidate.id}
                                className="group relative flex cursor-pointer items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-[#d4a843]/30 hover:bg-[#d4a843]/5 has-[:checked]:border-[#d4a843]/50 has-[:checked]:bg-[#d4a843]/10"
                            >
                                <input
                                    type="radio"
                                    name={`position_${position.id}`}
                                    value={candidate.id}
                                    className="peer sr-only"
                                    required
                                />

                                {/* Custom radio indicator */}
                                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-white/20 transition-colors peer-checked:border-[#d4a843] peer-checked:bg-[#d4a843]">
                                    <svg
                                        className="h-3 w-3 text-[#0a1628] opacity-0 peer-checked:opacity-100"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>

                                {/* Avatar */}
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white/70">
                                    {candidate.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)}
                                </div>

                                {/* Name */}
                                <span className="text-sm font-medium text-white/80 transition-colors group-hover:text-white peer-checked:text-white">
                                    {candidate.name}
                                </span>

                                {/* Checked indicator dot */}
                                <div className="ml-auto opacity-0 peer-checked:opacity-100">
                                    <div className="h-2 w-2 rounded-full bg-[#d4a843]" />
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            {/* Error message */}
            {state.error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 shrink-0"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="12" />
                        <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                    {state.error}
                </div>
            )}

            {/* Submit button */}
            <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-[#d4a843] to-[#c49535] text-base font-semibold text-[#0a1628] shadow-lg shadow-[#d4a843]/20 transition-all hover:from-[#e0b84e] hover:to-[#d4a843] hover:shadow-xl hover:shadow-[#d4a843]/30 active:scale-[0.98]"
            >
                {isPending ? (
                    <span className="flex items-center gap-2">
                        <svg
                            className="h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        Submitting Ballot…
                    </span>
                ) : (
                    "Submit Ballot"
                )}
            </Button>

            <p className="text-center text-xs text-white/30">
                Once submitted, your vote cannot be changed.
            </p>
        </form>
    );
}
