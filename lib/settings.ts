import { createClient, createAdminSupabase } from "./supabase/server";
import type { SiteSettings } from "./types";
import { DEFAULT_STORE } from "./defaults";

export function mergeSettings(partial?: Partial<SiteSettings>): SiteSettings {
  const base = DEFAULT_STORE.settings;
  if (!partial) return base;
  const out: any = { ...base };
  for (const k of Object.keys(base) as (keyof SiteSettings)[]) {
    const p = (partial as any)[k];
    if (p == null) { out[k] = (base as any)[k]; continue; }
    if (Array.isArray(p) || typeof p !== "object") { out[k] = p; continue; }
    out[k] = { ...(base as any)[k], ...p };
  }
  return out as SiteSettings;
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const sb = createClient();
    const { data } = await sb.from("settings").select("data").eq("id", 1).single();
    return mergeSettings(data?.data as Partial<SiteSettings>);
  } catch {
    return DEFAULT_STORE.settings;
  }
}

export async function saveSettingsSection<K extends keyof SiteSettings>(
  section: K,
  value: SiteSettings[K]
): Promise<void> {
  const sb = createAdminSupabase();
  const jsonValue = JSON.parse(JSON.stringify(value)); // ensure plain object
  const { error } = await sb.rpc("update_settings_section", {
    p_section: section as string,
    p_value: jsonValue,
  });
  if (error) throw new Error(error.message);
}
