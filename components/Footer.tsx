import Link from "next/link";
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import BrandLogo from "@/components/BrandLogo";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-brown-dark text-cream-light/80 text-sm">
      <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-4 gap-8 items-start">
        <div>
          <BrandLogo variant="negativo" signature width={180} height={80} />
        </div>
        <div className="space-y-2 text-xs tracking-widest font-semibold">
          <Link href="/" className="block hover:text-orange">HOME</Link>
          <Link href="/#sobre" className="block hover:text-orange">SOBRE</Link>
          <Link href="/produtos" className="block hover:text-orange">PRODUTOS</Link>
          <Link href="/#contato" className="block hover:text-orange">QUERO COMPRAR</Link>
          <Link href="/blog" className="block hover:text-orange">BLOG</Link>
          <Link href="/#contato" className="block hover:text-orange">CONTATO</Link>
        </div>
        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-orange mt-0.5" /><span>{settings.contact.address}</span></div>
          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-orange" /><span>{settings.contact.phone}</span></div>
          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-orange" /><span>{settings.contact.email}</span></div>
        </div>
        <div className="flex md:justify-end gap-4">
          <a href={settings.contact.facebook} aria-label="Facebook" className="text-cream-light hover:text-orange"><Facebook className="w-5 h-5" /></a>
          <a href={settings.contact.instagram} aria-label="Instagram" className="text-cream-light hover:text-orange"><Instagram className="w-5 h-5" /></a>
          <a href={settings.contact.linkedin} aria-label="LinkedIn" className="text-cream-light hover:text-orange"><Linkedin className="w-5 h-5" /></a>
        </div>
      </div>
      <div className="border-t border-brown-mid">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col md:flex-row justify-between text-[11px] text-cream-light/60">
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
