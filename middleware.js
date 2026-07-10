import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET || "bank-sampah-dev-secret-change-me";
const key = new TextEncoder().encode(secretKey);

export async function middleware(request) {
  const token = request.cookies.get("banksampah_session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, key);
    const { pathname } = request.nextUrl;

    // Admin-only routes
    if (pathname.startsWith("/dashboard/setoran") ||
        pathname.startsWith("/dashboard/jenis-sampah") ||
        pathname === "/dashboard/penarikan") {
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard/nasabah", request.url));
      }
    }

    // Nasabah-specific routes
    if (pathname.startsWith("/dashboard/riwayat") ||
        pathname.startsWith("/dashboard/penarikan-saya")) {
      if (payload.role !== "nasabah") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
