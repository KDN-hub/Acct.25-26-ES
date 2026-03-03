export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar placeholder */}
            <aside className="hidden w-64 border-r bg-muted/40 md:block">
                <div className="p-6">
                    <h2 className="text-lg font-semibold">Admin</h2>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1">{children}</div>
        </div>
    );
}
