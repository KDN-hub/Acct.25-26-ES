import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /elections-control routes (except /elections-control/login)
    if (pathname.startsWith("/elections-control") && !pathname.startsWith("/elections-control/login")) {
        const adminToken = request.cookies.get("admin_token");
        if (!adminToken) {
            return Response.redirect(new URL("/elections-control/login", request.url));
        }
    }

    // Process Supabase Auth for other routes like /vote
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
