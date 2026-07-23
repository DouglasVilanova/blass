import Link from "next/link";
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

const MENU = [
  { label: "HOME", href: "/" },
  { label: "SOBRE", href: "/#sobre" },
  { label: "PRODUTOS", href: "/produtos" },
  { label: "REPRESENTANTES", href: "/representantes" },
];

/** Divide o campo legado de telefone em vários números (separados por / ; , ou "(DD)") */
function splitPhones(raw: string): string[] {
  return raw
    .split(/[\/;,]|\s+(?=\()/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function Footer({ settings }: { settings: SiteSettings }) {
  const c = settings.contact;
  // Listas novas do painel; fallback: campos legados
  const phones = c.phones?.length ? c.phones : splitPhones(c.phone);
  const emails = c.emails?.length ? c.emails : c.email ? [c.email] : [];
  // Endereço com quebras (aceita Enter do painel e <br> digitado)
  const addressLines = c.address.split(/<\/?br\s*\/?>|\n/i).map((l) => l.trim()).filter(Boolean);

  return (
    <footer id="contato" className="bg-[#3C1C0E] text-cream-light/80 text-sm">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.6fr] items-start">
        {/* Logo + redes */}
        <div className="space-y-5">
          <img src="/novo/logo-rodape.webp" alt="Blass — Iluminação e Componentes" className="h-16 w-auto" />
          {/* Só mostra a rede se o link estiver preenchido no painel */}
          {(c.facebook?.trim() || c.instagram?.trim() || c.linkedin?.trim()) && (
            <div className="flex gap-4">
              {c.facebook?.trim() && (
                <a href={c.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-cream-light hover:text-orange transition-colors"><Facebook className="w-5 h-5" /></a>
              )}
              {c.instagram?.trim() && (
                <a href={c.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-cream-light hover:text-orange transition-colors"><Instagram className="w-5 h-5" /></a>
              )}
              {c.linkedin?.trim() && (
                <a href={c.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-cream-light hover:text-orange transition-colors"><Linkedin className="w-5 h-5" /></a>
              )}
            </div>
          )}
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
            <span>
              {addressLines.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </span>
          </div>
          {/* Telefones — um por linha, com respiro */}
          <div className="space-y-2">
            {phones.map((ph) => (
              <a
                key={ph}
                href={`tel:+55${ph.replace(/\D/g, "")}`}
                className="flex items-center gap-2 hover:text-orange transition-colors"
              >
                <Phone className="w-4 h-4 text-orange flex-shrink-0" />
                <span>{ph}</span>
              </a>
            ))}
          </div>
          <div className="space-y-2">
            {emails.map((em) => (
              <a key={em} href={`mailto:${em}`} className="flex items-center gap-2 hover:text-orange transition-colors">
                <Mail className="w-4 h-4 text-orange flex-shrink-0" />
                <span className="break-all">{em}</span>
              </a>
            ))}
          </div>
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
