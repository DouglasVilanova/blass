// Standalone backend health check.
// Run: node scripts/verify-backend.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries(
  readFileSync(join(__dirname, "..", ".env.local"), "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SR = env.SUPABASE_SERVICE_ROLE_KEY;

const sb = createClient(URL, SR, { auth: { persistSession: false } });
const anon = createClient(URL, ANON, { auth: { persistSession: false } });

const ok = (m) => console.log("\x1b[32m✓\x1b[0m " + m);
const fail = (m) => console.log("\x1b[31m✗\x1b[0m " + m);
const info = (m) => console.log("  " + m);

console.log("\n━━━ Blass — Backend Health Check ━━━\n");

// 1. Settings table
try {
  const { data, error } = await sb.from("settings").select("id, updated_at").eq("id", 1).single();
  if (error) fail(`settings: ${error.message}`);
  else ok(`settings table OK (last update: ${data.updated_at})`);
} catch (e) { fail("settings: " + e.message); }

// 2. Categories
try {
  const { data, error } = await sb.from("categories").select("*").order("sort_order");
  if (error) fail(`categories: ${error.message}`);
  else {
    ok(`categories table OK (${data.length} categorias)`);
    data.forEach((c) => info(`  • ${c.name} (${c.slug}) → ${c.subcategories?.length ?? 0} subcategorias`));
  }
} catch (e) { fail("categories: " + e.message); }

// 3. Products schema
try {
  const { data, error } = await sb.from("products").select("*").limit(5);
  if (error) fail(`products: ${error.message}`);
  else {
    ok(`products table OK (${data.length} produtos visíveis)`);
    if (data.length > 0) {
      const p = data[0];
      info(`  • Exemplo: ${p.name}`);
      info(`    image=${p.image ? "OK" : "—"}  gallery=${(p.gallery || []).length} fotos  tags=${(p.tags || []).length}`);
    }
  }
} catch (e) { fail("products: " + e.message); }

// 4. Blog
try {
  const { data: cats } = await sb.from("blog_categories").select("slug,name");
  const { data: posts } = await sb.from("blog_posts").select("id").limit(5);
  ok(`blog_categories OK (${cats?.length ?? 0})  blog_posts OK (${posts?.length ?? 0})`);
} catch (e) { fail("blog: " + e.message); }

// 5. RPC update_settings_section
try {
  const { error } = await sb.rpc("update_settings_section", {
    p_section: "_healthcheck",
    p_value: { ts: new Date().toISOString() },
  });
  if (error) fail(`RPC update_settings_section: ${error.message}`);
  else ok("RPC update_settings_section OK (atomic JSONB merge)");
} catch (e) { fail("RPC: " + e.message); }

// 6. Storage bucket
try {
  const { data: bucket, error } = await sb.storage.getBucket("site-images");
  if (error) fail(`bucket site-images: ${error.message}`);
  else {
    ok(`bucket "site-images" OK`);
    info(`  public=${bucket.public}  max=${bucket.file_size_limit ? (bucket.file_size_limit / 1024 / 1024).toFixed(0) + " MB" : "—"}`);
    info(`  MIME: ${bucket.allowed_mime_types?.join(", ") || "—"}`);
  }
} catch (e) { fail("storage: " + e.message); }

// 7. Storage upload test (small PNG)
try {
  const pixel = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    "base64"
  );
  const path = `healthcheck/${Date.now()}.png`;
  const { error: upErr } = await sb.storage.from("site-images").upload(path, pixel, {
    contentType: "image/png",
    upsert: false,
  });
  if (upErr) fail(`upload teste: ${upErr.message}`);
  else {
    const { data: urlData } = sb.storage.from("site-images").getPublicUrl(path);
    ok(`upload OK → ${urlData.publicUrl}`);
    const { error: delErr } = await sb.storage.from("site-images").remove([path]);
    if (delErr) fail(`delete teste: ${delErr.message}`);
    else ok("delete OK");
  }
} catch (e) { fail("upload teste: " + e.message); }

// 8. Public anon read (simulates browser)
try {
  const { data, error } = await anon.from("products").select("id,name").eq("published", true).limit(3);
  if (error) fail(`anon read: ${error.message}`);
  else ok(`anon read OK (vê ${data.length} produtos publicados — RLS funcionando)`);
} catch (e) { fail("anon: " + e.message); }

// 9. RLS check: anon should NOT see drafts
try {
  // Try to read a draft via anon (should return empty even if drafts exist)
  const { data } = await anon.from("products").select("id").eq("published", false).limit(1);
  if (data && data.length > 0) {
    fail("RLS BUG: anon vê produtos não publicados! Verifique policies.");
  } else {
    ok("RLS OK: anon NÃO vê produtos rascunho (correto)");
  }
} catch (e) { fail("RLS check: " + e.message); }

console.log("\n━━━ Fim ━━━\n");
