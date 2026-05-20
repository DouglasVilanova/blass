import Link from "next/link";
import { readStore } from "@/lib/store";

export const metadata = { title: "Produtos — Blass" };

export default async function ProductsIndex() {
  const { categories, products } = await readStore();
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="font-display text-4xl text-brown">Nossos produtos</h1>
        <p className="text-brown/80 mt-2 max-w-2xl">Explore por categoria ou veja a linha completa abaixo.</p>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/produtos/${c.slug}`}
              className="block bg-brown text-cream-light p-8 border border-orange/40 hover:bg-brown-mid transition-colors"
            >
              <div className="text-orange text-xs tracking-widest font-semibold">CATEGORIA</div>
              <div className="mt-1 font-display text-2xl uppercase">{c.name}</div>
              <p className="text-cream-light/80 text-sm mt-3">{c.description}</p>
              <div className="text-orange text-xs mt-4 tracking-wider">Ver produtos →</div>
            </Link>
          ))}
        </div>

        <h2 className="mt-16 font-display text-2xl text-brown">Todos os produtos</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.filter((p) => p.published !== false).map((p) => {
            const cat = categories.find((c) => c.slug === p.category);
            return (
              <Link
                key={p.id}
                href={`/produtos/${p.category}/${p.slug}`}
                className="group block bg-white border border-brown/10 hover:border-orange transition-colors"
              >
                <div className="aspect-square bg-cream-dark overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brown/30 text-xs">sem imagem</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-[10px] tracking-widest text-orange">{cat?.name?.toUpperCase()}</div>
                  <div className="font-semibold text-brown mt-1">{p.name}</div>
                  {p.shortDescription && <p className="text-xs text-brown/70 mt-1 line-clamp-2">{p.shortDescription}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
