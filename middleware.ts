import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "./lib/session";

export async function middleware(request: NextRequest) {
    const session = await getIronSession<SessionData>(request, await NextResponse.next(), sessionOptions);

    // --- ACCESS LOGGING ---
    // 'x-forwarded-for' is standard for proxies/Vercel.
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || (request as any).ip || 'Unknown IP';
    const user = session.user?.username || 'Guest';
    const path = request.nextUrl.pathname;
    const time = new Date().toISOString();

    console.log(JSON.stringify({
        level: 'INFO',
        type: 'ACCESS_LOG',
        time,
        ip,
        user,
        path,
        userAgent: request.headers.get('user-agent')
    }));
    // ----------------------

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
        "/entidades": "Sales",
    };

    const requestedPath = request.nextUrl.pathname;

    // Check for specific route permissions
    for (const [route, requiredGroup] of Object.entries(routePermissions)) {
        if (requestedPath.startsWith(route)) {
            const hasPermission = session.user.groups?.some(g => g.includes(requiredGroup));
            if (!hasPermission) {
                return NextResponse.redirect(new URL("/unauthorized", request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
