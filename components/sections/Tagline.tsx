import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export default function Tagline({ settings }: { settings: SiteSettings["tagline"] }) {
  return (
    <section className="relative bg-brown-dark text-cream-light overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: `url(${settings.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brown-dark via-brown-dark/40 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32 flex justify-end">
        <div className="max-w-md text-right md:text-left">
          <h2 className="font-display text-3xl md:text-4xl leading-snug">
            {settings.line1} <span className="text-orange">{settings.highlight1}</span>
            <br />{settings.line2} <span className="text-orange">{settings.highlight2}</span>
          </h2>
          <Link href={settings.ctaHref} className="mt-6 inline-block border border-cream-light/70 rounded-full px-6 py-3 text-xs tracking-wider hover:bg-orange hover:border-orange transition-colors">
            {settings.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
