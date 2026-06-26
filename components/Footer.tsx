import Link from "next/link";
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

const MENU = [
  { label: "HOME", href: "/" },
  { label: "SOBRE", href: "/#sobre" },
  { label: "PRODUTOS", href: "/produtos" },
  { label: "QUERO COMPRAR", href: "/#contato" },
  { label: "CONTATO", href: "/#contato" },
];

export default function Footer({ settings }: { settings: SiteSettings }) {
  const c = settings.contact;
  return (
    <footer className="bg-[#3C1C0E] text-cream-light/80 text-sm border-t border-[#6E5E53]">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-[1.3fr_1fr_1.6fr_auto] items-start">
        {/* Logo */}
        <div>
          <img src="/novo/logo-rodape.webp" alt="Blass — Iluminação e Componentes" className="h-16 w-auto" />
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2 text-xs tracking-widest font-semibold text-orange">
          {MENU.map((m) => (
            <Link key={m.label} href={m.href} className="hover:text-orange-light transition-colors">
              {m.label}
            </Link>
          ))}
        </nav>

        {/* Contato */}
        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" />
            <span>{c.address}</span>
          </div>
          <a href={`tel:+55${c.phoneDigits}`} className="flex items-center gap-2 hover:text-orange transition-colors">
            <Phone className="w-4 h-4 text-orange flex-shrink-0" />
            <span>{c.phone}</span>
          </a>
          <a href={`mailto:${c.email}`} className="flex items-center gap-2 hover:text-orange transition-colors">
            <Mail className="w-4 h-4 text-orange flex-shrink-0" />
            <span>{c.email}</span>
          </a>
        </div>

        {/* Redes */}
        <div className="flex md:justify-end gap-4">
          <a href={c.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-cream-light hover:text-orange transition-colors"><Facebook className="w-5 h-5" /></a>
          <a href={c.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-cream-light hover:text-orange transition-colors"><Instagram className="w-5 h-5" /></a>
          <a href={c.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-cream-light hover:text-orange transition-colors"><Linkedin className="w-5 h-5" /></a>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-[#6E5E53]/50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col md:flex-row justify-between gap-2 text-[11px] text-cream-light/55">
          <span>Copyright © {new Date().getFullYear()} — Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-orange">Políticas de Privacidade</Link>
            <span>•</span>
            <Link href="/gestao" className="hover:text-orange">Gestão</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
