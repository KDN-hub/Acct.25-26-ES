"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface AdminAuthState {
    error?: string;
}

export async function loginAdmin(
    _prevState: AdminAuthState,
    formData: FormData
): Promise<AdminAuthState> {
    const pin = formData.get("pin")?.toString().trim();

    // Default passcode if no environment variable is set
    const correctPin = process.env.ADMIN_PIN || "acct_election_25/26";

    if (!pin) {
        return { error: "Please enter the admin passcode." };
    }

    if (pin !== correctPin) {
        return { error: "Incorrect passcode." };
    }

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_token", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
    });

    redirect("/elections-control");
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
    redirect("/elections-control/login");
}
