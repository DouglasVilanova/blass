"use server";

import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { signToken, COOKIE_NAME, cookieOptions } from "@/lib/session";

export async function signIn(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/gestao");

  // Rate limit: 5 attempts / 15 min per IP+email
  const ip = headers().get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const { ok, resetAt } = rateLimit(`login:${ip}:${email}`, 5, 15 * 60 * 1000);
  if (!ok) {
    const mins = Math.ceil((resetAt - Date.now()) / 60_000);
    return { error: `Muitas tentativas. Aguarde ${mins} min.` };
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return { error: "Credenciais de admin não configuradas no servidor." };
  }

  if (email !== adminEmail || password !== adminPassword) {
    return { error: "E-mail ou senha incorretos." };
  }

  const token = await signToken(email);
  cookies().set(COOKIE_NAME, token, cookieOptions());

  redirect(next.startsWith("/gestao") ? next : "/gestao");
}

export async function signOut() {
  cookies().set(COOKIE_NAME, "", cookieOptions(0));
  redirect("/gestao/login");
}
