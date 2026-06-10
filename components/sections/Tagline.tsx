import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

/**
 * Tagline section.
 * - Sem imagem: renderiza textos React sobre fundo marrom.
 * - Com imagem: renderiza banner full-bleed (assume design self-contained, sem overlay de texto).
 */
export default function Tagline({ settings }: { settings: SiteSettings["tagline"] }) {
  // Fallback: usa banner.png oficial quando não há imagem customizada no admin
  const imageUrl = settings.image || "/brand/banner.webp";

  if (imageUrl) {
    return (
      <section className="relative bg-brown-dark overflow-hidden">
        <Link href={settings.ctaHref} className="block group" aria-label={settings.ctaLabel}>
          <img
            src={imageUrl}
            alt={`${settings.line1} ${settings.highlight1} ${settings.line2} ${settings.highlight2}`}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          />
        </Link>
      </section>
    );
  }

  return (
    <section className="relative bg-brown-dark text-cream-light overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32 flex justify-end">
        <div className="max-w-md text-right md:text-left">
          <h2 className="font-display text-3xl md:text-4xl leading-snug">
            {settings.line1} <span className="text-orange">{settings.highlight1}</span>
            <br />{settings.line2} <span className="text-orange">{settings.highlight2}</span>
          </h2>
          <Link
            href={settings.ctaHref}
            className="mt-6 inline-block border border-cream-light/70 rounded-full px-6 py-3 text-xs tracking-wider hover:bg-orange hover:border-orange transition-colors"
          >
            {settings.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
