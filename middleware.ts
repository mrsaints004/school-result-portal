import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin routes — require admin role
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Student routes — require student role
    if (pathname.startsWith("/student") && token?.role !== "student") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};
