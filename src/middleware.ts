import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me",
  });

  const isAuthenticated = Boolean(token);
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && token) {
    const userRole = (token.role as string | undefined)?.toLowerCase();

    if (pathname.startsWith("/dashboard/manajer") && userRole !== "manajer") {
      console.warn(`[Middleware Reject] User '${token.username}' dengan role '${userRole}' mencoba menyusup ke halaman manajer.`);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

      if (pathname === "/dashboard" && userRole === "manajer") {
      return NextResponse.redirect(new URL("/dashboard/manajer", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};