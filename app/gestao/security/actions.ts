"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin, validatePassword } from "@/lib/auth-guard";

export async function changePassword(
  _prev: { error?: string; ok?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin();

  const newPassword = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (newPassword !== confirm) return { error: "Senhas não coincidem." };

  const err = validatePassword(newPassword);
  if (err) return { error: err };

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };

  return { ok: true };
}
