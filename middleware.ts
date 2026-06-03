import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/gestao")) return NextResponse.next();

  const isLoginPage = pathname === "/gestao/login";
  const token = req.cookies.get(COOKIE_NAME)?.value;

  let email: string | null = null;
  if (token) {
    try {
      email = await verifyToken(token);
    } catch {
      email = null;
    }
  }

  if (!email && !isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/gestao/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (email && isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/gestao";
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/gestao/:path*"],
};
