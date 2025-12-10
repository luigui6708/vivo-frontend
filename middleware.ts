import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "./lib/session";

export async function middleware(request: NextRequest) {
    const session = await getIronSession<SessionData>(request, await NextResponse.next(), sessionOptions);

    // Verify generic session
    if (!session.user?.isLoggedIn) {
        // Allow public routes (e.g. login, unauthorized)
        const publicRoutes = ['/login', '/unauthorized'];
        if (publicRoutes.some(p => request.nextUrl.pathname.startsWith(p))) return NextResponse.next();

        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Define route-to-group mapping
    const routePermissions: { [key: string]: string } = {
        "/recepcion": "Inventory",
        "/produccion": "Manufacturing",
        "/calidad": "Manufacturing",
        "/ventas": "Sales",
        "/entidades": "Sales", // Using Sales for now, can be Contacts
    };

    const requestedPath = request.nextUrl.pathname;

    // Check for specific route permissions
    for (const [route, requiredGroup] of Object.entries(routePermissions)) {
        if (requestedPath.startsWith(route)) {
            const hasPermission = session.user.groups?.some(g => g.includes(requiredGroup));
            if (!hasPermission) {
                // User logged in but unauthorized for this specific route
                return NextResponse.redirect(new URL("/unauthorized", request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    // Match strict paths to avoid protecting static files, api, etc.
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
