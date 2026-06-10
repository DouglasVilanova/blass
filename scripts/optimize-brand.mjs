// Otimiza PNGs estáticos em public/brand/ para WebP.
// Run: node scripts/optimize-brand.mjs
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const DIR = "public/brand";
const FILES = ["banner.png", "compani.png", "brasil.png"];

// Per-file profile (largura máx + quality)
const PROFILE = {
  "banner.png":  { width: 2000, quality: 85 }, // tagline banner full-bleed
  "compani.png": { width: 1200, quality: 85 }, // foto fachada (About)
  "brasil.png":  { width: 800,  quality: 90 }, // mapa contorno
};

console.log("\n━━━ Optimizing brand assets ━━━\n");

for (const file of FILES) {
  const src = join(DIR, file);
  const dst = src.replace(".png", ".webp");

  try {
    const before = (await stat(src)).size;
    const { width, quality } = PROFILE[file];

    await sharp(src)
      .resize({ width, withoutEnlargement: true, fit: "inside" })
      .webp({ quality, effort: 6 })
      .toFile(dst);

    const after = (await stat(dst)).size;
    const pct = (((before - after) / before) * 100).toFixed(0);

    console.log(
      `✓ ${file.padEnd(15)} ${(before / 1024).toFixed(0).padStart(5)} KB → ${(after / 1024).toFixed(0).padStart(5)} KB  (-${pct}%)  → ${file.replace(".png", ".webp")}`
    );
  } catch (e) {
    console.log(`✗ ${file}: ${e.message}`);
  }
}

console.log("\nLogos da marca (manter PNG por transparência precisa):");
const logos = (await readdir(DIR)).filter((f) => f.startsWith("logo") && f.endsWith(".png"));
for (const file of logos) {
  const src = join(DIR, file);
  const dst = src.replace(".png", ".webp");
  const before = (await stat(src)).size;

  await sharp(src)
    .webp({ quality: 95, effort: 6, alphaQuality: 100 })
    .toFile(dst);

  const after = (await stat(dst)).size;
  const pct = (((before - after) / before) * 100).toFixed(0);
  console.log(
    `✓ ${file.padEnd(35)} ${(before / 1024).toFixed(0).padStart(4)} KB → ${(after / 1024).toFixed(0).padStart(4)} KB  (-${pct}%)`
  );
}

console.log("\n━━━ Fim ━━━\n");
