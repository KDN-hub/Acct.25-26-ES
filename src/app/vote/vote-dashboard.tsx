"use client";

import { useState, useEffect, useActionState } from "react";
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

export function VoteDashboard({
    voterName,
    positions,
    electionDeadlineMs,
}: {
    voterName: string;
    positions: Position[];
    electionDeadlineMs: number;
}) {
    const [activePositionIndex, setActivePositionIndex] = useState(0);
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [state, formAction, isPending] = useActionState(
        submitVotes,
        initialState
    );
    const [isClosed, setIsClosed] = useState(() => Date.now() >= electionDeadlineMs);

    // Auto-close when deadline is reached
    useEffect(() => {
        if (isClosed) return;
        const remaining = electionDeadlineMs - Date.now();
        if (remaining <= 0) {
            setIsClosed(true);
            return;
        }
        const timer = setTimeout(() => setIsClosed(true), remaining);
        return () => clearTimeout(timer);
    }, [electionDeadlineMs, isClosed]);

    const activePosition = positions[activePositionIndex];
    const totalPositions = positions.length;
    const selectedCount = Object.keys(selections).length;
    const allSelected = selectedCount === totalPositions;

    function toggleCandidate(positionId: string, candidateId: string) {
        setSelections((prev) => {
            if (prev[positionId] === candidateId) {
                const next = { ...prev };
                delete next[positionId];
                return next;
            }
            return { ...prev, [positionId]: candidateId };
        });
    }

    function goToNext() {
        if (activePositionIndex < totalPositions - 1) {
            setActivePositionIndex((i) => i + 1);
        }
    }

    function goToPrev() {
        if (activePositionIndex > 0) {
            setActivePositionIndex((i) => i - 1);
        }
    }



    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* ── Animated background ── */}
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f1f3d] to-[#0a1628]" />
                <div className="absolute -left-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[#d4a843]/8 blur-[120px] animate-pulse" />
                <div className="absolute -right-32 bottom-1/4 h-[25rem] w-[25rem] rounded-full bg-[#d4a843]/6 blur-[100px] animate-pulse [animation-delay:2s]" />
                <div className="absolute left-1/2 top-0 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-blue-500/4 blur-[100px] animate-pulse [animation-delay:4s]" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(212,168,67,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,0.3) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="flex min-h-screen flex-col lg:flex-row">
                {/* ── Sidebar ── */}
                <aside className="relative w-full border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl lg:w-72 lg:border-b-0 lg:border-r lg:bg-white/[0.03]">
                    {/* Header */}
                    <div className="border-b border-white/[0.06] p-4 lg:p-5">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute -inset-1 rounded-xl bg-[#d4a843]/20 blur-md" />
                                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4a843] to-[#c49535] text-sm font-bold text-[#0a1628] shadow-lg shadow-[#d4a843]/25">
                                    {voterName.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">
                                    {voterName}
                                </p>
                                <p className="text-xs text-white/40">Voter Dashboard</p>
                            </div>
                        </div>
                    </div>

                    {/* Position list — horizontal scroll on mobile, vertical on desktop */}
                    <nav className="flex gap-1.5 overflow-x-auto p-2 lg:flex-col lg:overflow-x-visible lg:p-3 scrollbar-hide">
                        {positions.map((position, index) => {
                            const isActive = index === activePositionIndex;
                            const isSelected = !!selections[position.id];


                            return (
                                <button
                                    key={position.id}
                                    onClick={() => setActivePositionIndex(index)}
                                    className={`group flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 lg:w-full ${isActive
                                        ? "bg-[#d4a843]/10 text-[#d4a843] shadow-sm shadow-[#d4a843]/10"
                                        : "text-white/50 hover:bg-white/[0.04] hover:text-white/70"
                                        }`}
                                >
                                    {/* Status indicator */}
                                    <span
                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs transition-all duration-300 ${isSelected
                                            ? "bg-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/10"
                                            : isActive
                                                ? "bg-[#d4a843]/20 text-[#d4a843]"
                                                : "bg-white/[0.06] text-white/30"
                                            }`}
                                    >
                                        {isSelected ? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3.5 w-3.5">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : (
                                            index + 1
                                        )}
                                    </span>
                                    <span className="hidden truncate font-medium lg:block">
                                        {position.name}
                                    </span>
                                    {/* Mobile label */}
                                    <span className="truncate text-xs font-medium lg:hidden">
                                        {position.name.split(" ")[0]}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Progress — desktop only */}
                    <div className="hidden border-t border-white/[0.06] p-4 lg:block">
                        <div className="mb-2.5 flex justify-between text-xs">
                            <span className="font-medium text-white/50">Progress</span>
                            <span className="font-semibold text-[#d4a843]">
                                {selectedCount}/{totalPositions}
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#d4a843] to-[#e0b84e] transition-all duration-700 ease-out"
                                style={{
                                    width: `${(selectedCount / totalPositions) * 100}%`,
                                }}
                            />
                        </div>
                        {selectedCount > 0 && (
                            <p className="mt-2 text-[10px] text-white/30">
                                {totalPositions - selectedCount === 0
                                    ? "All positions selected ✓"
                                    : `${totalPositions - selectedCount} position${totalPositions - selectedCount > 1 ? "s" : ""} remaining`}
                            </p>
                        )}
                    </div>

                    {/* Mobile progress bar */}
                    <div className="px-3 pb-2 lg:hidden">
                        <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#d4a843] to-[#e0b84e] transition-all duration-700 ease-out"
                                style={{
                                    width: `${(selectedCount / totalPositions) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                </aside>

                {/* ── Main content ── */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {activePosition ? (
                        <div className="mx-auto max-w-2xl">
                            {/* Position header */}
                            <div className="mb-6 lg:mb-8">
                                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#d4a843]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#d4a843]">
                                    Position {activePositionIndex + 1} of {totalPositions}
                                </div>
                                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                                    {activePosition.name}
                                </h2>
                                <p className="mt-1.5 text-sm text-white/40">
                                    Tap a candidate to select. Tap again to deselect.
                                </p>
                            </div>

                            {/* Candidate cards */}
                            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                                {activePosition.candidates.map((candidate) => {
                                    const isSelected =
                                        selections[activePosition.id] === candidate.id;

                                    return (
                                        <button
                                            key={candidate.id}
                                            type="button"
                                            onClick={() =>
                                                toggleCandidate(activePosition.id, candidate.id)
                                            }
                                            className={`group relative flex flex-col items-center gap-4 rounded-2xl border p-5 sm:p-6 text-center transition-all duration-300 ${isSelected
                                                ? "border-[#d4a843]/40 bg-gradient-to-b from-[#d4a843]/15 to-[#d4a843]/5 shadow-xl shadow-[#d4a843]/10 scale-[1.02]"
                                                : "border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.06] hover:scale-[1.01] hover:shadow-lg hover:shadow-black/20"
                                                }`}
                                        >
                                            {/* Selection ring effect */}
                                            {isSelected && (
                                                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-[#d4a843]/30 to-transparent -z-10 blur-[1px]" />
                                            )}

                                            {/* Selected badge */}
                                            <div
                                                className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${isSelected
                                                    ? "bg-[#d4a843] scale-100 opacity-100 shadow-lg shadow-[#d4a843]/30"
                                                    : "bg-white/10 scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-40"
                                                    }`}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke={isSelected ? "#0a1628" : "white"} strokeWidth="3" className="h-3.5 w-3.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </div>

                                            {/* Candidate photo/avatar */}
                                            <div className="relative">
                                                {isSelected && (
                                                    <div className="absolute -inset-2 rounded-full bg-[#d4a843]/20 blur-lg animate-pulse" />
                                                )}
                                                {candidate.image_url ? (
                                                    <img
                                                        src={candidate.image_url}
                                                        alt={candidate.name}
                                                        className={`relative h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover transition-all duration-300 ${isSelected
                                                            ? "border-[3px] border-[#d4a843] shadow-lg shadow-[#d4a843]/20"
                                                            : "border-2 border-white/10 group-hover:border-white/20"
                                                            }`}
                                                    />
                                                ) : (
                                                    <div
                                                        className={`relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full text-xl sm:text-2xl font-bold transition-all duration-300 ${isSelected
                                                            ? "bg-gradient-to-br from-[#d4a843]/30 to-[#d4a843]/10 text-[#d4a843] border-[3px] border-[#d4a843]/50 shadow-lg shadow-[#d4a843]/20"
                                                            : "bg-gradient-to-br from-white/10 to-white/5 text-white/50 border-2 border-white/10 group-hover:border-white/20 group-hover:text-white/60"
                                                            }`}
                                                    >
                                                        {candidate.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .slice(0, 2)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Name */}
                                            <span
                                                className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${isSelected ? "text-[#d4a843]" : "text-white/80 group-hover:text-white"
                                                    }`}
                                            >
                                                {candidate.name}
                                            </span>

                                            {/* Subtle "tap to select" hint */}
                                            <span
                                                className={`text-[10px] transition-all duration-300 ${isSelected
                                                    ? "text-[#d4a843]/50"
                                                    : "text-white/20 group-hover:text-white/30"
                                                    }`}
                                            >
                                                {isSelected ? "Tap to deselect" : "Tap to select"}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Navigation buttons */}
                            <div className="mt-6 flex items-center justify-between gap-3 sm:mt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={goToPrev}
                                    disabled={activePositionIndex === 0}
                                    className="h-11 rounded-xl border-white/10 bg-white/[0.03] text-white/60 backdrop-blur-sm hover:bg-white/[0.08] hover:text-white disabled:opacity-20 transition-all"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5 h-4 w-4">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                    Previous
                                </Button>

                                {activePositionIndex < totalPositions - 1 ? (
                                    <Button
                                        type="button"
                                        onClick={goToNext}
                                        className="h-11 rounded-xl bg-white/10 text-white backdrop-blur-sm hover:bg-white/15 transition-all"
                                    >
                                        Next
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1.5 h-4 w-4">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </Button>
                                ) : selectedCount > 0 ? (
                                    <Button
                                        type="button"
                                        onClick={() => setShowConfirm(true)}
                                        disabled={isClosed}
                                        className="h-11 rounded-xl bg-gradient-to-r from-[#d4a843] to-[#c49535] font-semibold text-[#0a1628] shadow-lg shadow-[#d4a843]/25 hover:from-[#e0b84e] hover:to-[#d4a843] hover:shadow-xl hover:shadow-[#d4a843]/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5 h-4 w-4">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                        {isClosed ? "Voting Ended" : "Submit Ballot"}
                                    </Button>
                                ) : (
                                    <span className="rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-white/30">
                                        Select at least 1 position
                                    </span>
                                )}
                            </div>

                            {/* Error message */}
                            {state.error && (
                                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" x2="12" y1="8" y2="12" />
                                        <line x1="12" x2="12.01" y1="16" y2="16" />
                                    </svg>
                                    {state.error}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-white/40">
                            No positions available.
                        </div>
                    )}
                </main>
            </div>

            {/* ── Confirmation modal ── */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md sm:items-center">
                    <div className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-300 rounded-t-3xl border border-white/[0.08] bg-gradient-to-b from-[#0f1f3d] to-[#0a1628] p-6 shadow-2xl sm:rounded-2xl sm:mx-4">
                        {/* Modal header */}
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4a843]/15">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" className="h-5 w-5">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    Confirm Your Ballot
                                </h3>
                                <p className="text-xs text-white/40">
                                    Review your selections before submitting
                                </p>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="max-h-52 space-y-1.5 overflow-y-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                            {positions.map((position, index) => {
                                const candidateId = selections[position.id];
                                const candidate = position.candidates.find(
                                    (c) => c.id === candidateId
                                );
                                const skipped = !candidate;

                                return (
                                    <div
                                        key={position.id}
                                        className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${skipped ? "opacity-40" : "bg-white/[0.02]"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2 text-white/50">
                                            {position.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-medium ${skipped ? "text-white/30 italic" : "text-[#d4a843]"}`}>
                                                {skipped ? "Skipped" : candidate?.name}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowConfirm(false);
                                                    setActivePositionIndex(index);
                                                }}
                                                className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/60"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="mt-3 text-center text-[11px] text-white/30">
                            Once submitted, your vote cannot be changed.
                        </p>

                        <div className="mt-5 flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowConfirm(false)}
                                className="h-11 flex-1 rounded-xl border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.08] hover:text-white"
                            >
                                Go Back
                            </Button>
                            <form action={formAction} className="flex-1">
                                {/* Hidden inputs for all selections */}
                                {positions.map((position) =>
                                    selections[position.id] ? (
                                        <input
                                            key={position.id}
                                            type="hidden"
                                            name={`position_${position.id}`}
                                            value={selections[position.id]}
                                        />
                                    ) : null
                                )}
                                <Button
                                    type="submit"
                                    disabled={isPending || isClosed}
                                    className="h-11 w-full rounded-xl bg-gradient-to-r from-[#d4a843] to-[#c49535] font-semibold text-[#0a1628] shadow-lg shadow-[#d4a843]/25 hover:from-[#e0b84e] hover:to-[#d4a843] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPending ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Submitting…
                                        </span>
                                    ) : (
                                        "Confirm & Submit"
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
