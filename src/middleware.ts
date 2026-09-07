import { NextRequest, NextResponse } from "next/server";
import { verifyJwtTokenAsync } from "@/lib/auth/jwt";

// Protected route boundaries mapping required roles
const PROTECTED_ROUTES: { prefix: string; allowedRoles: string[] }[] = [
  { prefix: "/admin", allowedRoles: ["ADMIN"] },
  { prefix: "/cafeteria", allowedRoles: ["ADMIN", "CAFETERIA_MANAGER"] },
  { prefix: "/events", allowedRoles: ["ADMIN", "EVENT_MANAGER", "CAFETERIA_MANAGER"] },
  { prefix: "/recipient", allowedRoles: ["ADMIN", "RECIPIENT_ORGANIZATION"] },
  { prefix: "/api/admin", allowedRoles: ["ADMIN"] },
  { prefix: "/api/prediction", allowedRoles: ["ADMIN", "CAFETERIA_MANAGER"] },
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const matchedRoute = PROTECTED_ROUTES.find((r) => pathname.startsWith(r.prefix));
  if (!matchedRoute) {
    return NextResponse.next();
  }

  const tokenCookie = req.cookies.get("auth_token");
  if (!tokenCookie || !tokenCookie.value) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const user = await verifyJwtTokenAsync(tokenCookie.value);
  if (!user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!matchedRoute.allowedRoles.includes(user.role)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Unauthorized role access" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/access-denied", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/cafeteria/:path*",
    "/events/:path*",
    "/recipient/:path*",
    "/api/admin/:path*",
    "/api/prediction/:path*",
  ],
};
