import Link from "next/link";
import { Boxes, FileText, Home, Tags, Eye, Code2, LogOut, LayoutGrid, Image as ImageIcon, BarChart3, Sparkles, Megaphone, Phone, Type, Shield } from "lucide-react";
import { ToastProvider } from "@/components/gestao/Toast";
import { getSettings } from "@/lib/settings";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/session";
import { signOut } from "@/app/gestao/login/actions";
import type { SiteVisibility } from "@/lib/types";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  visibilityKey?: keyof SiteVisibility;
};

const BLOCOS: Item[] = [
  { href: "/gestao/blocos/menu", label: "Menu / Logo", icon: LayoutGrid },
  { href: "/gestao/blocos/hero", label: "Hero", icon: ImageIcon },
  { href: "/gestao/blocos/sobre", label: "Sobre", icon: Type },
  { href: "/gestao/blocos/categorias-cards", label: "Cards de Categorias", icon: Boxes },
  { href: "/gestao/blocos/stats", label: "Estatísticas", icon: BarChart3, visibilityKey: "stats" },
  { href: "/gestao/blocos/tagline", label: "Faixa Tagline", icon: Megaphone, visibilityKey: "tagline" },
  { href: "/gestao/blocos/destaque", label: "Destaque", icon: Sparkles, visibilityKey: "highlight" },
  { href: "/gestao/blocos/reach", label: "CTA / Reach", icon: Megaphone, visibilityKey: "reach" },
  { href: "/gestao/blocos/rodape", label: "Rodapé / Contato", icon: Phone },
];

const GERAL: Item[] = [
  { href: "/gestao", label: "Painel", icon: Home },
  { href: "/gestao/produtos", label: "Produtos", icon: Boxes },
  { href: "/gestao/categorias", label: "Categorias", icon: Tags },
  { href: "/gestao/blog", label: "Blog", icon: FileText },
  { href: "/gestao/visibilidade", label: "Visibilidade", icon: Eye },
  { href: "/gestao/seo", label: "SEO", icon: Code2 },
  { href: "/gestao/security", label: "Segurança", icon: Shield },
];

function filterByVisibility(items: Item[], v: SiteVisibility) {
  return items.filter((i) => !i.visibilityKey || v[i.visibilityKey]);
}

export default async function GestaoLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const blocos = filterByVisibility(BLOCOS, settings.visibility);

  // Get current user for display (may be null on login page)
  let userEmail: string | null = null;
  try {
    const token = cookies().get(COOKIE_NAME)?.value;
    if (token) userEmail = await verifyToken(token);
  } catch { /* no-op */ }

  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-cream-light text-brown">
        <aside className="w-64 bg-brown text-cream-light flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
          <div className="p-6">
            <img src="/brand/logo-negativo.png" alt="Blass" width={130} height={38} />
            <div className="text-[10px] tracking-widest text-orange mt-2">GESTÃO</div>
          </div>

          <nav className="flex flex-col">
            <SidebarLabel>Geral</SidebarLabel>
            {GERAL.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 px-6 py-2.5 text-sm hover:bg-brown-mid hover:text-orange transition-colors">
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}

            <SidebarLabel>Blocos da página</SidebarLabel>
            {blocos.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 px-6 py-2.5 text-sm hover:bg-brown-mid hover:text-orange transition-colors">
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto px-6 pb-6 pt-8 space-y-3 border-t border-brown-mid mt-8">
            {userEmail && (
              <div className="text-[10px] text-cream-light/40 truncate">{userEmail}</div>
            )}
            <Link href="/" className="flex items-center gap-2 text-[11px] text-cream-light/40 hover:text-orange">
              <LogOut className="w-3 h-3" /> voltar ao site
            </Link>
            {userEmail && (
              <form action={signOut}>
                <button type="submit" className="flex items-center gap-2 text-[11px] text-cream-light/40 hover:text-red-400">
                  <LogOut className="w-3 h-3" /> sair
                </button>
              </form>
            )}
          </div>
        </aside>
        <main className="flex-1 p-10 overflow-auto">{children}</main>
      </div>
    </ToastProvider>
  );
}

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-6 pt-6 pb-2 text-[10px] tracking-widest text-cream-light/40 uppercase">{children}</div>;
}
