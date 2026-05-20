import Link from "next/link";
import { notFound } from "next/navigation";
import { readStore } from "@/lib/store";

export default async function ProductDetail({ params }: { params: { categoria: string; slug: string } }) {
  const { categories, products, settings } = await readStore();
  const cat = categories.find((c) => c.slug === params.categoria);
  const product = products.find((p) => p.slug === params.slug && p.category === params.categoria);
  if (!cat || !product) notFound();

  const sub = cat.subcategories.find((s) => s.slug === product.subcategory);
  const waMsg = encodeURIComponent(`Olá! Tenho interesse no produto: ${product.name}`);

  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-6xl px-6">
        <nav className="text-xs text-brown/60 mb-6">
          <Link href="/produtos" className="hover:text-orange">Produtos</Link>
          <span className="mx-2">/</span>
          <Link href={`/produtos/${cat.slug}`} className="hover:text-orange">{cat.name}</Link>
          {sub && (<><span className="mx-2">/</span><span>{sub.name}</span></>)}
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-white border border-brown/10 overflow-hidden">
            {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
          </div>
          <div>
            <div className="text-xs tracking-widest text-orange">{cat.name.toUpperCase()}{sub ? ` • ${sub.name.toUpperCase()}` : ""}</div>
            <h1 className="font-display text-4xl text-brown mt-2">{product.name}</h1>
            {product.shortDescription && <p className="text-brown/80 mt-3">{product.shortDescription}</p>}
            {product.description && (
              <div className="mt-6 prose prose-sm text-brown/85 whitespace-pre-line">{product.description}</div>
            )}
            <a
              href={`https://wa.me/55${settings.contact.phoneDigits}?text=${waMsg}`}
              target="_blank"
              rel="noreferrer"
              className="btn-orange mt-8"
            >
              QUERO COMPRAR
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
