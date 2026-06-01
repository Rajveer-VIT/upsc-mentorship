import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * src/middleware.ts
 * Next.js Edge Middleware for route protection
 * Separate auth tokens for users and admins
 */

// Define protected routes
const userProtectedRoutes = ["/dashboard", "/profile"];
const adminProtectedRoutes = ["/dashboard/admin", "/admin"];
const authRoutes = ["/login", "/register", "/forgot-password", "/admin-login", "/admin-signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for separate auth tokens
  const userToken = request.cookies.get("user_auth_token")?.value;
  const adminToken = request.cookies.get("admin_auth_token")?.value;

  // Determine if route is protected
  const isAdminProtectedRoute = adminProtectedRoutes.some((route) => pathname.startsWith(route));
  const isUserProtectedRoute = userProtectedRoutes.some((route) => pathname.startsWith(route)) && !isAdminProtectedRoute;
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Special case: /admin-login should be accessible without admin token
  if (pathname.startsWith("/admin-login") || pathname.startsWith("/admin-signup")) {
    if (adminToken) {
      // If already logged in as admin, redirect to admin dashboard
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }
    return NextResponse.next();
  }

  // Prevent regular users from visiting admin pages while user logged in
  if (userToken && (pathname.startsWith("/admin-login") || pathname.startsWith("/admin-signup"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect admin routes - only admin token required
  if (isAdminProtectedRoute && !adminToken) {
    const redirectUrl = new URL("/admin-login", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Protect user routes - only user token required
  if (isUserProtectedRoute && !userToken) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/profile/:path*", "/admin-login", "/admin-signup", "/login", "/register"]
};
