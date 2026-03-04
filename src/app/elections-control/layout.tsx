import { logoutAdmin } from "@/app/actions/admin-auth";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated background */}
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f1f3d] to-[#0a1628]" />
                <div className="absolute -left-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[#d4a843]/8 blur-[120px] animate-pulse" />
                <div className="absolute -right-32 bottom-1/3 h-[25rem] w-[25rem] rounded-full bg-blue-500/5 blur-[100px] animate-pulse [animation-delay:3s]" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(212,168,67,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,0.3) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            {/* Logout button header */}
            <div className="absolute right-4 top-4 z-50 sm:right-8 sm:top-8">
                <form action={logoutAdmin}>
                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/60 backdrop-blur-md transition-all hover:bg-white/[0.08] hover:text-white"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>
                        Logout
                    </button>
                </form>
            </div>

            {children}
        </div>
    );
}
