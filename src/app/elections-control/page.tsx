import { logoutAdmin } from "@/app/actions/admin-auth";
import AdminDashboardClient from "./admin-dashboard-client";

export default async function AdminPage() {
    return <AdminDashboardClient logoutAction={logoutAdmin} />;
}
