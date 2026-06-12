/**
 * Redimensiona/comprime uma imagem no browser ANTES do upload.
 *
 * Motivo: serverless functions na Vercel rejeitam request body > 4.5 MB (HTTP 413).
 * Fotos de celular passam disso fácil. Aqui derrubamos a resolução para no máximo
 * `maxDim` px e exportamos JPEG de alta qualidade, o que deixa o arquivo bem abaixo
 * do limite. O Sharp no servidor ainda refina para WebP otimizado.
 *
 * GIF e SVG não são rasterizados aqui (animação/vetor) — seguem como estão; se forem
 * grandes demais, o erro 413 original ainda apareceria, mas são casos raros.
 */
const MAX_DIM = 2400;
const JPEG_QUALITY = 0.9;

export async function compressImage(file: File, maxDim = MAX_DIM): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  // Formatos que não fazem sentido rasterizar no client
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file; // navegador não suportou — deixa o servidor lidar
  }

  const { width, height } = bitmap;
  const scale = Math.min(1, maxDim / Math.max(width, height));
  const targetW = Math.round(width * scale);
  const targetH = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close?.();

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
  );
  if (!blob) return file;

  // Se por algum motivo ficou maior que o original, manda o original
  if (blob.size >= file.size) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}
