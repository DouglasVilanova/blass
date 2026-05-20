/**
 * Store facade — now backed by Supabase.
 * Kept for backward compatibility with existing page imports.
 */
import { getCategories, getProducts, getBlogCategories, getBlogPosts } from "./db";
import { getSettings } from "./settings";
import type { Store } from "./types";
import { DEFAULT_STORE } from "./defaults";

export async function readStore(): Promise<Store> {
  try {
    const [settings, categories, products, blogCategories, blogPosts] = await Promise.all([
      getSettings(),
      getCategories(),
      getProducts(),
      getBlogCategories(),
      getBlogPosts(),
    ]);
    return { settings, categories, products, blogCategories, blogPosts };
  } catch {
    return DEFAULT_STORE;
  }
}

// writeStore no longer used — each entity saved individually via db.ts
export async function writeStore(_next: Store): Promise<void> {
  // no-op: individual db functions handle writes
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// mutate kept for compatibility — bypassed, individual saves preferred
export async function mutate<T>(fn: (s: Store) => T | Promise<T>): Promise<T> {
  const s = await readStore();
  return fn(s);
}
