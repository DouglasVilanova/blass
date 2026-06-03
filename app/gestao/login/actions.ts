"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export async function signIn(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/gestao");

  // Rate limit: 5 attempts / 15 min per IP+email
  const ip = headers().get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const key = `login:${ip}:${email}`;
  const { ok, resetAt } = rateLimit(key, 5, 15 * 60 * 1000);
  if (!ok) {
    const mins = Math.ceil((resetAt - Date.now()) / 60_000);
    return { error: `Muitas tentativas. Tente novamente em ${mins} min.` };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: "E-mail ou senha incorretos." };

  redirect(next);
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/gestao/login");
}
