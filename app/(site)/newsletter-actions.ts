"use server";

import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { addNewsletterSubscriber } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function subscribeNewsletter(
  _prev: { ok?: boolean; error?: string } | null,
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return { error: "Digite um e-mail válido." };
  }
  if (email.length > 254) return { error: "E-mail muito longo." };

  // Rate limit: 5 inscrições / hora por IP (evita spam na tabela)
  const ip = headers().get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const { ok } = rateLimit(`newsletter:${ip}`, 5, 60 * 60 * 1000);
  if (!ok) return { error: "Muitas tentativas. Tente novamente mais tarde." };

  try {
    await addNewsletterSubscriber(email);
    return { ok: true };
  } catch {
    return { error: "Não foi possível cadastrar agora. Tente novamente." };
  }
}
