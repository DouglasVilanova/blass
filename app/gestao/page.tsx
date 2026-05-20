import Link from "next/link";
import { readStore } from "@/lib/store";

export default async function GestaoDashboard() {
  const { categories, products, blogPosts } = await readStore();
  const cards = [
    { label: "Produtos", value: products.length, href: "/gestao/produtos" },
    { label: "Categorias", value: categories.length, href: "/gestao/categorias" },
    { label: "Subcategorias", value: categories.reduce((n, c) => n + c.subcategories.length, 0), href: "/gestao/categorias" },
    { label: "Posts do blog", value: blogPosts.length, href: "/gestao/blog" },
  ];
  return (
    <div>
      <h1 className="font-display text-3xl">Painel</h1>
      <p className="text-brown/70 mt-2">Visão geral do conteúdo do site.</p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="block bg-white border border-brown/10 hover:border-orange p-6 transition-colors">
            <div className="text-xs tracking-widest text-orange">{c.label.toUpperCase()}</div>
            <div className="font-display text-4xl text-brown mt-2">{c.value}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
