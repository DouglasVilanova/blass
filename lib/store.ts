import fs from "node:fs/promises";
import path from "node:path";
import type { Store } from "./types";
import { DEFAULT_STORE } from "./defaults";

// On serverless (Vercel) the project filesystem is read-only at runtime.
// Use /tmp when not running locally. Local dev keeps state in ./data.
const IS_SERVERLESS = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const ROOT = IS_SERVERLESS ? "/tmp" : process.cwd();
const FILE = path.join(ROOT, "data", "store.json");

let memCache: Store | null = null;

async function ensureFile() {
  const dir = path.dirname(FILE);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.access(FILE);
  } catch {
    try {
      await fs.writeFile(FILE, JSON.stringify(DEFAULT_STORE, null, 2), "utf8");
    } catch {
      // read-only filesystem: fall back to in-memory cache
    }
  }
}

export async function readStore(): Promise<Store> {
  if (memCache) return memCache;
  try {
    await ensureFile();
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Store;
    memCache = parsed;
    return parsed;
  } catch {
    memCache = DEFAULT_STORE;
    return DEFAULT_STORE;
  }
}

export async function writeStore(next: Store): Promise<void> {
  memCache = next;
  try {
    await ensureFile();
    await fs.writeFile(FILE, JSON.stringify(next, null, 2), "utf8");
  } catch {
    // ignore — kept in memory until process restart
  }
}

export async function mutate<T>(fn: (s: Store) => T | Promise<T>): Promise<T> {
  const s = await readStore();
  const result = await fn(s);
  await writeStore(s);
  return result;
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
