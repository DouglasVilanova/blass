import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/**
 * Call at the top of every Server Action that writes data.
 * Returns the authenticated Supabase client.
 * Throws/redirects if no valid session.
 */
export async function requireAdmin() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/gestao/login");
  return { supabase, user };
}

export function validatePassword(password: string): string | null {
  if (password.length < 10) return "Mínimo 10 caracteres.";
  if (!/[A-Z]/.test(password)) return "Deve conter ao menos uma letra maiúscula.";
  if (!/[a-z]/.test(password)) return "Deve conter ao menos uma letra minúscula.";
  if (!/[0-9]/.test(password)) return "Deve conter ao menos um número.";
  return null;
}
