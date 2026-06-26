"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Menu, X } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

const NAV = [
  { label: "HOME", href: "/" },
  { label: "A BLASS", href: "/#sobre" },
  { label: "PRODUTOS", href: "/produtos" },
  { label: "BLOG", href: "/blog" },
  { label: "REVENDAS", href: "/#contato" },
  { label: "CONTATO", href: "/#contato" },
];

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.789-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

export default function Header({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  // Home: header sobreposto ao hero (transparente). Demais páginas: ocupa espaço, fundo sólido.
  const isHome = usePathname() === "/";
  const wa = settings.contact.phoneDigits
    ? `https://wa.me/55${settings.contact.phoneDigits}`
    : settings.contact.instagram;

  return (
    <header
      className={
        isHome
          ? "absolute top-0 left-0 right-0 z-50 pt-4 md:pt-6"
          : "relative z-50 bg-night-deep pt-4 md:pt-6 pb-4"
      }
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col items-center gap-3">
        {/* Símbolo */}
        <Link href="/" aria-label="Início — Blass" className="block">
          <img src="/novo/simbolo.webp" alt="Blass" className="h-10 md:h-14 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]" />
        </Link>

        {/* Barra de menu — pill flutuante */}
        <nav className="w-full max-w-4xl rounded-full border border-cream-light/25 bg-night-deep/40 backdrop-blur-md px-4 md:px-7 h-14 flex items-center justify-between gap-3">
          {/* Logo texto */}
          <Link href="/" aria-label="Início — Blass" className="flex-shrink-0">
            <img src="/novo/logo-menu.webp" alt="Blass" className="h-4 md:h-[18px] w-auto" />
          </Link>

          {/* Itens (desktop) */}
          <div className="hidden lg:flex items-center gap-6 text-[12px] tracking-[0.1em] font-medium">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} className="text-cream-light/85 hover:text-orange transition-colors">
                {n.label}
              </Link>
            ))}
          </div>

          {/* Direita: redes + hamburguer */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a href={wa} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="text-cream-light/85 hover:text-orange transition-colors">
              <WhatsappIcon className="w-[18px] h-[18px]" />
            </a>
            <a href={settings.contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-cream-light/85 hover:text-orange transition-colors">
              <Instagram className="w-[18px] h-[18px]" />
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              className="lg:hidden text-cream-light/90 hover:text-orange transition-colors ml-1"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-night-deep/97 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between px-5 h-16">
            <img src="/novo/logo-menu.webp" alt="Blass" className="h-5 w-auto" />
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar menu" className="text-cream-light hover:text-orange">
              <X className="w-7 h-7" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center gap-7">
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                onClick={() => setOpen(false)}
                className="font-exo text-cream-light text-2xl tracking-wide hover:text-orange transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-center gap-6 pb-10">
            <a href={wa} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="text-cream-light hover:text-orange">
              <WhatsappIcon className="w-6 h-6" />
            </a>
            <a href={settings.contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-cream-light hover:text-orange">
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
