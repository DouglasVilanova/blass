import Link from "next/link";
import { Facebook, Instagram, Linkedin, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import BrandLogo from "@/components/BrandLogo";

const NAV = [
  { label: "SOBRE", href: "/#sobre" },
  { label: "PRODUTOS", href: "/produtos" },
  { label: "QUERO COMPRAR", href: "/#contato" },
  { label: "CATÁLOGO", href: "/produtos" },
  { label: "BLOG", href: "/blog" },
  { label: "CONTATO", href: "/#contato" },
];

export default function Header({ settings }: { settings: SiteSettings }) {
  return (
    <header className="bg-brown text-cream-light text-sm">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Início — Blass">
          <BrandLogo variant="negativo" width={110} height={32} priority />
        </Link>
        <nav className="hidden lg:flex items-center gap-7 text-[12px] tracking-wider">
          {NAV.map((n) => (
            <Link key={n.href + n.label} href={n.href} className="hover:text-orange transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-[12px]">
          <span className="hidden md:flex items-center gap-2">
            <Phone className="w-4 h-4 text-orange" /> LIGUE: {settings.contact.phone}
          </span>
          <span className="hidden md:inline text-orange">|</span>
          <a href={settings.contact.facebook} className="hover:text-orange" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
          <a href={settings.contact.instagram} className="hover:text-orange" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
          <a href={settings.contact.linkedin} className="hover:text-orange" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a>
        </div>
      </div>
    </header>
  );
}
