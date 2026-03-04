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

            {children}
        </div>
    );
}
