/** Helpers de SEO — URL base, limpeza de HTML e resolução de URL absoluta. */

export const SITE_URL = "https://blass.ind.br";

/** Descrição padrão da empresa (usada quando o painel não define uma). */
export const DEFAULT_DESCRIPTION =
  "Há mais de duas décadas desenvolvendo soluções em iluminação e componentes para móveis, unindo design, tecnologia e qualidade.";

/** Remove tags HTML e normaliza espaços (para descrições a partir do corpo rico). */
export function stripHtml(s?: string): string {
  return (s ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/** Garante URL absoluta (imagens do Supabase já são absolutas; assets locais recebem o domínio). */
export function absUrl(u?: string): string | undefined {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  return `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`;
}

/** Corta um texto em até `max` chars sem quebrar palavra no meio. */
export function clampText(s: string, max = 160): string {
  const t = s.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}
