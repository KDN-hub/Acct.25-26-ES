"use client";

import { useState, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

interface AdminDashboardClientProps {
    logoutAction: () => Promise<void>;
}

export default function AdminDashboardClient({
    logoutAction,
}: AdminDashboardClientProps) {
    const [results, setResults] = useState<PositionResult[]>([]);
    const [totalVoters, setTotalVoters] = useState(0);
    const [votedCount, setVotedCount] = useState(0);
    const [participation, setParticipation] = useState(0);
    const [electionStatus, setElectionStatus] = useState("Ongoing");
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isElectionEnded = electionStatus === "Ended";

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch("/api/election-results", {
                cache: "no-store",
                headers: { "Cache-Control": "no-cache" },
            });
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();

            setResults(data.results);
            setTotalVoters(data.totalVoters);
            setVotedCount(data.votedCount);
            setParticipation(data.participation);
            setElectionStatus(data.electionStatus);
            setLastUpdated(new Date());
            setIsLoading(false);
        } catch (err) {
            console.error("Failed to fetch election results:", err);
        }
    }, []);

    // Fetch on mount + auto-refresh every 10 seconds
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [fetchData]);

    function generatePDF() {
        setIsGenerating(true);

        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            // ─── Header ───
            doc.setFillColor(15, 31, 61); // dark blue
            doc.rect(0, 0, pageWidth, 40, "F");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(212, 168, 67); // gold
            doc.text("ALBU's ELECTORAL RESULTS", pageWidth / 2, 22, { align: "center" });

            doc.setFontSize(10);
            doc.setTextColor(180, 200, 230);
            doc.text("Accounting Department 25/26 Session", pageWidth / 2, 32, { align: "center" });

            // ─── Summary section ───
            let yPos = 52;
            doc.setFillColor(240, 245, 255);
            doc.roundedRect(14, yPos - 6, pageWidth - 28, 22, 3, 3, "F");

            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(15, 31, 61);
            doc.text("Total Eligible Voters: 531", 20, yPos + 2);

            doc.text(
                `Actual Turnout: ${votedCount} of ${totalVoters} (${participation}%)`,
                20,
                yPos + 10
            );

            yPos += 28;

            // ─── Results per office ───
            results.forEach((position) => {
                if (yPos > doc.internal.pageSize.getHeight() - 50) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFontSize(13);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(15, 31, 61);
                doc.text(position.name, 14, yPos);
                yPos += 2;

                const maxVoteCount = Math.max(...position.candidates.map((c) => c.vote_count));

                autoTable(doc, {
                    startY: yPos,
                    head: [["Candidate Name", "Votes Received"]],
                    body: position.candidates.map((candidate) => [
                        candidate.name,
                        candidate.vote_count.toString(),
                    ]),
                    margin: { left: 14, right: 14 },
                    headStyles: {
                        fillColor: [15, 31, 61],
                        textColor: [212, 168, 67],
                        fontStyle: "bold",
                        fontSize: 10,
                    },
                    bodyStyles: {
                        fontSize: 10,
                        textColor: [30, 30, 30],
                    },
                    alternateRowStyles: {
                        fillColor: [248, 250, 255],
                    },
                    didParseCell: (data) => {
                        if (data.section === "body") {
                            const candidateIndex = data.row.index;
                            const candidate = position.candidates[candidateIndex];
                            if (
                                candidate &&
                                candidate.vote_count === maxVoteCount &&
                                candidate.vote_count > 0
                            ) {
                                data.cell.styles.fillColor = [255, 248, 225];
                                data.cell.styles.fontStyle = "bold";
                                data.cell.styles.textColor = [15, 31, 61];
                            }
                        }
                    },
                    theme: "grid",
                    styles: {
                        lineColor: [200, 210, 225],
                        lineWidth: 0.3,
                    },
                });

                yPos = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;
            });

            // ─── Footer ───
            const currentDate = new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });

            const totalPages = doc.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                const pageHeight = doc.internal.pageSize.getHeight();

                doc.setDrawColor(200, 210, 225);
                doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);

                doc.setFontSize(8);
                doc.setFont("helvetica", "italic");
                doc.setTextColor(120, 130, 145);
                doc.text(
                    `This is an official document generated by the AD E-Voting System on ${currentDate}.`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: "center" }
                );
            }

            doc.save("ALBU_Electoral_Results.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGenerating(false);
        }
    }

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <svg className="h-8 w-8 animate-spin text-[#d4a843]" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-sm text-white/50">Loading election data...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white sm:text-4xl">
                        Election <span className="text-[#d4a843]">Results</span>
                    </h1>
                    <p className="mt-1.5 text-sm text-white/40">
                        Live results for the Accounting Department election
                        {lastUpdated && (
                            <span className="ml-2 text-white/25">
                                · Updated {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Download PDF button */}
                    <button
                        onClick={generatePDF}
                        disabled={!isElectionEnded || isGenerating}
                        title={
                            !isElectionEnded
                                ? "Available after the election ends"
                                : "Download election results as PDF"
                        }
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium backdrop-blur-md transition-all sm:px-4 ${
                            isElectionEnded
                                ? "border-[#d4a843]/30 bg-[#d4a843]/10 text-[#d4a843] hover:bg-[#d4a843]/20 hover:border-[#d4a843]/50 hover:shadow-[0_0_15px_rgba(212,168,67,0.15)]"
                                : "cursor-not-allowed border-white/5 bg-white/[0.02] text-white/25"
                        }`}
                    >
                        {isGenerating ? (
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" x2="12" y1="15" y2="3" />
                            </svg>
                        )}
                        <span className="hidden sm:inline">
                            {isGenerating ? "Generating..." : "Download Results PDF"}
                        </span>
                    </button>

                    {/* Logout button */}
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-white/60 backdrop-blur-md transition-all hover:bg-white/[0.08] hover:text-white sm:px-4"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" x2="9" y1="12" y2="12" />
                            </svg>
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* Stats bar */}
            <div className="mb-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-sm">
                    <p className="text-xs font-medium uppercase tracking-wider text-white/40">Total Voters</p>
                    <p className="mt-1 text-2xl font-bold text-white">{totalVoters}</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-sm">
                    <p className="text-xs font-medium uppercase tracking-wider text-white/40">Votes Cast</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-400">{votedCount}</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-sm">
                    <p className="text-xs font-medium uppercase tracking-wider text-white/40">Participation</p>
                    <p className="mt-1 text-2xl font-bold text-[#d4a843]">{participation}%</p>
                </div>
            </div>

            {/* Data integrity check */}
            {(() => {
                const totalVotesInSystem = results.reduce((sum, pos) => sum + pos.totalVotes, 0);
                const maxVotesForAnyPosition = Math.max(...results.map(p => p.totalVotes), 0);
                const hasDiscrepancy = votedCount > 0 && maxVotesForAnyPosition > 0 && 
                    maxVotesForAnyPosition < Math.round(votedCount * 0.5);

                if (hasDiscrepancy) {
                    return (
                        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300/80">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0">
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                <line x1="12" x2="12" y1="9" y2="13" />
                                <line x1="12" x2="12.01" y1="17" y2="17" />
                            </svg>
                            <div>
                                <span className="font-semibold text-red-300">Data Discrepancy Detected: </span>
                                {votedCount} voters marked as voted, but the highest position only has {maxVotesForAnyPosition} votes.
                                Total vote records across all positions: {totalVotesInSystem}.
                            </div>
                        </div>
                    );
                }
                return null;
            })()}

            {/* Election status indicator */}
            {!isElectionEnded && (
                <div className="mb-6 flex items-center gap-2 rounded-xl border border-amber-500/10 bg-amber-500/5 px-4 py-2.5 text-sm text-amber-300/70">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="12" />
                        <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                    Election is <span className="font-semibold text-amber-300">{electionStatus}</span> — PDF download will be available once the election ends.
                </div>
            )}

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
