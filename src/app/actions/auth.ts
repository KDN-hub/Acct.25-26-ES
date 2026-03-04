"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
    error?: string;
}

export async function loginWithMatric(
    _prevState: AuthState,
    formData: FormData
): Promise<AuthState> {
    const name = formData.get("name")?.toString().trim();
    const matricNumber = formData.get("matric_number")?.toString().trim();

    if (!name) {
        return { error: "Please enter your name." };
    }

    if (!matricNumber) {
        return { error: "Please enter your matric number." };
    }

    const supabase = await createClient();

    // Look up the voter by matric number
    const { data: voter, error } = await supabase
        .from("voters")
        .select("*")
        .eq("matric_number", matricNumber)
        .maybeSingle();

    console.log("Supabase query result:", { voter, error, matricNumber });

    if (error) {
        return { error: `Database error: ${error.message}` };
    }

    if (!voter) {
        return { error: "Matric number not found. Ensure you are registered." };
    }

    if (voter.has_voted) {
        return { error: "You have already voted." };
    }

    // Set secure HTTP-only cookies
    const cookieStore = await cookies();
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60, // 1 hour
    };

    cookieStore.set("matric_number", matricNumber, cookieOptions);
    cookieStore.set("voter_name", name, cookieOptions);

    redirect("/vote");
}
