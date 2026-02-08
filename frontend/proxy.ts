
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
   const token = request.cookies.get("token")?.value;
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/room/") && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/room/:path*"],
};
