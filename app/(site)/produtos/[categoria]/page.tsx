import Link from "next/link";
import { notFound } from "next/navigation";
import { readStore } from "@/lib/store";

export default async function CategoryPage({ params }: { params: { categoria: string } }) {
  const { categories, products } = await readStore();
  const cat = categories.find((c) => c.slug === params.categoria);
  if (!cat) notFound();
  const items = products.filter((p) => p.category === cat.slug && p.published !== false);

  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-xs tracking-widest text-orange">CATEGORIA</div>
        <h1 className="font-display text-4xl text-brown">{cat.name}</h1>
        <p className="text-brown/80 mt-2 max-w-2xl">{cat.description}</p>

        {cat.subcategories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {cat.subcategories.map((sc) => (
              <a
                key={sc.slug}
                href={`#sub-${sc.slug}`}
                className="text-xs px-3 py-1 border border-brown/30 text-brown hover:bg-orange hover:text-white hover:border-orange transition-colors"
              >
                {sc.name}
              </a>
            ))}
          </div>
        )}

        {cat.subcategories.map((sc) => {
          const subItems = items.filter((p) => p.subcategory === sc.slug);
          if (subItems.length === 0) return null;
          return (
            <div key={sc.slug} id={`sub-${sc.slug}`} className="mt-12">
              <h2 className="font-display text-2xl text-brown border-b border-brown/20 pb-2">{sc.name}</h2>
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {subItems.map((p) => (
                  <Link key={p.id} href={`/produtos/${cat.slug}/${p.slug}`} className="group block bg-white border border-brown/10 hover:border-orange transition-colors">
                    <div className="aspect-square bg-cream-dark overflow-hidden">
                      {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                    </div>
                    <div className="p-4">
                      <div className="font-semibold text-brown">{p.name}</div>
                      {p.shortDescription && <p className="text-xs text-brown/70 mt-1 line-clamp-2">{p.shortDescription}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
