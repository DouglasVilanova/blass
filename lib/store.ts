import fs from "node:fs/promises";
import path from "node:path";
import type { Store } from "./types";
import { DEFAULT_STORE } from "./defaults";

const FILE = path.join(process.cwd(), "data", "store.json");

async function ensureFile() {
  const dir = path.dirname(FILE);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, JSON.stringify(DEFAULT_STORE, null, 2), "utf8");
  }
}

export async function readStore(): Promise<Store> {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf8");
  try {
    return JSON.parse(raw) as Store;
  } catch {
    return DEFAULT_STORE;
  }
}

export async function writeStore(next: Store): Promise<void> {
  await ensureFile();
  await fs.writeFile(FILE, JSON.stringify(next, null, 2), "utf8");
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
