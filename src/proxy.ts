import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "change-this-to-a-64-char-random-hex-string-in-production-please"
);

const JWT_COOKIE_NAME = "mendyr_access_token";

// Route protection rules
const PROTECTED_ROUTES: Record<string, string[]> = {
  "/admin": ["ADMIN", "SUPER_ADMIN"],
  "/super-admin": ["SUPER_ADMIN"],
  "/nurse": ["NURSE"],
  "/patient": ["PATIENT"],
};

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/become-a-nurse",
  "/contact",
  "/login",
  "/register",
  "/forgot-password",
];

const AUTH_ROUTES = ["/login", "/register"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}


function getProtectedRouteRoles(pathname: string): string[] | null {
  for (const [route, roles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return roles;
    }
  }
  return null;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // API routes: auth API is public, other API routes are handled by route-level guards
  if (isApiRoute(pathname)) {
    const response = NextResponse.next();
    // Add security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    return response;
  }

  // Public routes — always accessible
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check JWT for protected routes
  const token =
    request.cookies.get(JWT_COOKIE_NAME)?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    // Redirect to login with return URL
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      issuer: "mendyr",
    });

    const userRole = payload.role as string;
    const requiredRoles = getProtectedRouteRoles(pathname);

    if (requiredRoles && !requiredRoles.includes(userRole)) {
      // User is authenticated but not authorized — redirect to their dashboard
      const dashboardRedirects: Record<string, string> = {
        SUPER_ADMIN: "/super-admin",
        ADMIN: "/admin",
        NURSE: "/nurse",
        PATIENT: "/patient",
      };
      const redirect = dashboardRedirects[userRole] || "/";
      return NextResponse.redirect(new URL(redirect, request.url));
    }

    // Authenticated users trying to visit login/register — redirect to their dashboard
    if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
      const dashboardRedirects: Record<string, string> = {
        SUPER_ADMIN: "/super-admin",
        ADMIN: "/admin",
        NURSE: "/nurse",
        PATIENT: "/patient",
      };
      const redirect = dashboardRedirects[userRole] || "/";
      return NextResponse.redirect(new URL(redirect, request.url));
    }

    return NextResponse.next();
  } catch {
    // Invalid token — clear cookie and redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(JWT_COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
