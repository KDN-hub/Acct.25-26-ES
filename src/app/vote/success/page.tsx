import Link from "next/link";

export default function VoteSuccessPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="flex max-w-md flex-col items-center gap-6 text-center">
                {/* Success icon */}
                <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-green-500/10 blur-xl" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-10 w-10"
                        >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Vote <span className="text-green-400">Submitted!</span>
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-white/50">
                        Your ballot has been recorded successfully. Thank you for
                        participating in the Accounting Department election.
                    </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] px-6 py-4">
                    <p className="text-xs text-white/40">
                        Your vote is anonymous and encrypted. You cannot vote again with the
                        same matric number.
                    </p>
                </div>

                <Link
                    href="/"
                    className="mt-2 inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-8 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
}
