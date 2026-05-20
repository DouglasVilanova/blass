import { readStore, writeStore } from "./store";
import type { SiteSettings } from "./types";
import { DEFAULT_STORE } from "./defaults";

/** Deep merge of partial settings over defaults so missing keys never break the LP. */
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
    const s = await readStore();
    return mergeSettings(s.settings);
  } catch {
    return DEFAULT_STORE.settings;
  }
}

export async function saveSettingsSection<K extends keyof SiteSettings>(
  section: K,
  value: SiteSettings[K] | Partial<SiteSettings[K]>
): Promise<void> {
  const s = await readStore();
  const current = (s.settings as any)[section];
  if (Array.isArray(value) || typeof value !== "object" || value === null) {
    (s.settings as any)[section] = value;
  } else {
    (s.settings as any)[section] = { ...current, ...value };
  }
  await writeStore(s);
}
