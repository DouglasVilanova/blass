// Otimiza os assets do "SITE BLASS NOVO" → public/novo/*.webp com nomes limpos.
// Uso: node scripts/optimize-novo.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "..", "SITE BLASS NOVO");
const OUT = join(__dirname, "..", "public", "novo");
mkdirSync(OUT, { recursive: true });

// [arquivo origem, nome destino (sem ext), largura máx, qualidade]
const JOBS = [
  ["BANNER HEADER.png", "hero", 2400, 86],
  ["LOGO MENU.png", "logo-menu", 900, 92],
  ["LOGO RODAPÉ.png", "logo-rodape", 900, 92],
  ["SIMBOLO SITE.png", "simbolo", 400, 92],
  ["BLASS 1.png", "blass-1", 1200, 88],

  ["BANNER APAGADO ILUMINAÇÃO.png", "cat-iluminacao-off", 1400, 88],
  ["BANNER ACESO ILUMINAÇÃO.png", "cat-iluminacao-on", 1400, 88],
  ["BANNER APAGADO COMPONENTES.png", "cat-componentes-off", 1400, 88],
  ["BANNER ACESO COMPONENTES.png", "cat-componentes-on", 1400, 88],
  ["BANNER APAGADO ACESSÓRIOS.png", "cat-acessorios-off", 1400, 88],
  ["BANNER ACESO ACESSÓRIOS.png", "cat-acessorios-on", 1400, 88],

  ["BANNER TENDENCIAS COMPLETO.png", "tendencias", 2400, 86],
  ["BANNER TENDENCIAS FUNDO.png", "tendencias-fundo", 2400, 86],
  ["BANNER NOVIDADES.jpg", "novidades", 1400, 84],

  ["Mão.png", "mao", 1200, 86],
  ["BRILHO.png", "brilho", 1400, 86],
  ["CARROSSEL.png", "carrossel", 2000, 86],

  ["GALERIA/GALERIA 1.jpg", "galeria-1", 900, 82],
  ["GALERIA/GALERIA 2.jpg", "galeria-2", 900, 82],
  ["GALERIA/GALERIA 3.jpg", "galeria-3", 900, 82],
  ["GALERIA/GALERIA 4.jpg", "galeria-4", 900, 82],
  ["GALERIA/GALERIA 5.jpg", "galeria-5", 900, 82],
];

let totalIn = 0, totalOut = 0;
for (const [src, name, width, quality] of JOBS) {
  try {
    const input = join(SRC, src);
    const output = join(OUT, name + ".webp");
    const meta = await sharp(input).metadata();
    const buf = await sharp(input)
      .resize({ width, withoutEnlargement: true, fit: "inside" })
      .webp({ quality, effort: 5 })
      .toBuffer();
    const fs = await import("node:fs");
    fs.writeFileSync(output, buf);
    const inKB = Math.round((meta.size ?? 0) / 1024);
    const outKB = Math.round(buf.length / 1024);
    totalIn += inKB; totalOut += outKB;
    console.log(`✓ ${name}.webp  ${meta.width}x${meta.height}  ${outKB}KB`);
  } catch (e) {
    console.error(`✗ ${src}: ${e.message}`);
  }
}
console.log(`\nTotal: ${totalIn}KB → ${totalOut}KB`);
