"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { saveSettingsSection } from "@/lib/settings";
import type { SiteSettings } from "@/lib/types";

export async function saveSection<K extends keyof SiteSettings>(
  section: K,
  value: SiteSettings[K]
): Promise<{ ok: true } | { error: string }> {
  try {
    await requireAdmin();
    await saveSettingsSection(section, value);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e: any) {
    return { error: e?.message ?? "Erro ao salvar" };
  }
}
