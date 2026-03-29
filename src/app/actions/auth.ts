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

    // Normalize: trim, collapse spaces, uppercase
    const normalizedMatric = matricNumber.replace(/\s+/g, " ").trim().toUpperCase();

    const supabase = await createClient();

    // Try exact match first
    let { data: voter, error } = await supabase
        .from("voters")
        .select("*")
        .eq("matric_number", normalizedMatric)
        .maybeSingle();

    // If no exact match, try case-insensitive search
    if (!voter && !error) {
        const { data: fuzzyVoter, error: fuzzyError } = await supabase
            .from("voters")
            .select("*")
            .ilike("matric_number", normalizedMatric)
            .maybeSingle();
        voter = fuzzyVoter;
        error = fuzzyError;
    }

    // Also try without leading/trailing spaces in the DB value
    if (!voter && !error) {
        const { data: trimVoter, error: trimError } = await supabase
            .from("voters")
            .select("*")
            .ilike("matric_number", `%${normalizedMatric}%`)
            .maybeSingle();
        voter = trimVoter;
        error = trimError;
    }

    console.log("Supabase query result:", { voter, error, matricNumber: normalizedMatric });

    if (error) {
        return { error: `Database error: ${error.message}` };
    }

    if (!voter) {
        return { error: "Incorrect matric number" };
    }

    if (voter.has_voted) {
        return { error: "You have already voted." };
    }

    // Update the voter's name in the database
    const { error: updateError } = await supabase
        .from("voters")
        .update({ full_name: name })
        .eq("matric_number", matricNumber);

    if (updateError) {
        console.error("Failed to update voter name:", updateError);
        return { error: "An error occurred while linking your name." };
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
