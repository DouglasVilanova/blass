import sharp from "sharp";
import { createAdminSupabase } from "./supabase/server";

export type UploadResult = { url: string; path: string };

const BUCKET = "site-images";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

const MAX_INPUT_BYTES = 15 * 1024 * 1024; // 15 MB input

/**
 * Per-folder optimization profile.
 * - "site": banners de Hero/Tagline/Destaque — precisam de mais resolução
 *   pra full-bleed em telas 1920px+ sem perder qualidade.
 * - "products" + "blog": cards e thumbnails — 1600px é suficiente.
 */
const PROFILE: Record<"products" | "blog" | "site", { width: number; quality: number }> = {
  site: { width: 2400, quality: 90 },    // full-bleed banners
  products: { width: 1600, quality: 85 }, // product cards + detail
  blog: { width: 1600, quality: 85 },     // blog cover + content
};

/**
 * Optimize image via Sharp → WebP, then upload to Supabase Storage.
 * SVG files are uploaded as-is (no raster conversion).
 * Aspect ratio is always preserved — never stretches.
 */
export async function uploadImage(
  file: File,
  folder: "products" | "blog" | "site" = "products"
): Promise<UploadResult> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error(`Tipo não permitido: ${file.type}`);
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("Arquivo maior que 15 MB");
  }

  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  let outputBuffer: Buffer;
  let contentType: string;
  let ext: string;

  if (file.type === "image/svg+xml") {
    // SVG: keep as-is (vectors don't benefit from raster conversion)
    outputBuffer = inputBuffer;
    contentType = "image/svg+xml";
    ext = "svg";
  } else {
    const { width, quality } = PROFILE[folder];
    // Raster: convert to WebP with per-folder profile.
    // `withoutEnlargement: true` = nunca aumenta (preserva qualidade original se menor).
    // `fit: "inside"` + sem `height` = preserva aspect ratio, nunca estica.
    outputBuffer = await sharp(inputBuffer)
      .rotate() // respeita EXIF orientation
      .resize({ width, withoutEnlargement: true, fit: "inside" })
      .webp({ quality, effort: 5 }) // effort 5 = melhor compressão sem ficar lento
      .toBuffer();
    contentType = "image/webp";
    ext = "webp";
  }

  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 7);
  const path = `${folder}/${timestamp}-${random}.${ext}`;

  const sb = createAdminSupabase();
  const { error } = await sb.storage
    .from(BUCKET)
    .upload(path, outputBuffer, { contentType, upsert: false });

  if (error) throw new Error(`Upload falhou: ${error.message}`);

  const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(path);
  return { url: urlData.publicUrl, path };
}

export async function deleteImage(path: string): Promise<void> {
  const sb = createAdminSupabase();
  await sb.storage.from(BUCKET).remove([path]);
}

/**
 * Delete multiple storage objects by their full public URLs.
 * Silently ignores URLs that are not from our bucket (external images).
 */
export async function deleteImageUrls(urls: string[]): Promise<void> {
  const paths = urls
    .map(urlToPath)
    .filter((p) => p && !p.startsWith("http")); // only bucket paths
  if (paths.length === 0) return;
  const sb = createAdminSupabase();
  await sb.storage.from(BUCKET).remove(paths);
}

/** Extract storage path from a full public URL */
export function urlToPath(url: string): string {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  return idx >= 0 ? url.slice(idx + marker.length) : url;
}
