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

const MAX_INPUT_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Optimize image via Sharp → WebP, then upload to Supabase Storage.
 * SVG files are uploaded as-is (no raster conversion).
 */
export async function uploadImage(
  file: File,
  folder: "products" | "blog" | "site" = "products"
): Promise<UploadResult> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error(`Tipo não permitido: ${file.type}`);
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("Arquivo maior que 10 MB");
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
    // Raster: convert to WebP, max 1400px wide, quality 82
    outputBuffer = await sharp(inputBuffer)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 82 })
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

/** Extract storage path from a full public URL */
export function urlToPath(url: string): string {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  return idx >= 0 ? url.slice(idx + marker.length) : url;
}
