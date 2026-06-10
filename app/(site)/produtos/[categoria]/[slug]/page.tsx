import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getProductBySlug } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { getAdminEmail } from "@/lib/session-server";
import ProductGallery from "@/components/site/ProductGallery";
import AdminProductBar from "@/components/site/AdminProductBar";

type Props = { params: { categoria: string; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug, params.categoria);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription ?? product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductDetail({ params }: Props) {
  const [categories, product, settings, adminEmail] = await Promise.all([
    getCategories(),
    getProductBySlug(params.slug, params.categoria),
    getSettings(),
    getAdminEmail(),
  ]);
  const isAdmin = !!adminEmail;

  const cat = categories.find((c) => c.slug === params.categoria);
  if (!cat || !product) notFound();

  const sub = cat.subcategories.find((s) => s.slug === product.subcategory);
  const waMsg = encodeURIComponent(`Olá! Tenho interesse no produto: ${product.name}`);

  const allImages = [
    ...(product.image ? [product.image] : []),
    ...(product.gallery ?? []),
  ];

  return (
    <div className="bg-cream min-h-screen">
      {/* Admin bar — only when logged in */}
      {isAdmin && (
        <AdminProductBar
          productId={product.id}
          productName={product.name}
          category={cat.slug}
        />
      )}

      {/* Breadcrumb */}
      <div className="bg-brown/5 border-b border-brown/10">
        <div className="mx-auto max-w-6xl px-6 py-3 text-xs text-brown/50 flex items-center gap-2">
          <Link href="/produtos" className="hover:text-orange">Produtos</Link>
          <span>/</span>
          <Link href={`/produtos?cat=${cat.slug}`} className="hover:text-orange">{cat.name}</Link>
          {sub && (<><span>/</span><span>{sub.name}</span></>)}
          <span>/</span>
          <span className="text-brown/80">{product.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          <ProductGallery images={allImages} productName={product.name} />

          <div className="space-y-6">
            <div>
              <div className="text-xs tracking-widest text-orange font-semibold">
                {cat.name.toUpperCase()}{sub ? ` • ${sub.name.toUpperCase()}` : ""}
              </div>
              <h1 className="font-display text-4xl text-brown mt-2">{product.name}</h1>
              {product.shortDescription && (
                <p className="text-brown/80 mt-3 text-lg leading-relaxed">{product.shortDescription}</p>
              )}
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 border border-brown/20 text-brown/70">{tag}</span>
                ))}
              </div>
            )}

            {product.description && (
              <div className="prose prose-sm text-brown/80 whitespace-pre-line border-t border-brown/10 pt-6">
                {product.description}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/55${settings.contact.phoneDigits}?text=${waMsg}`}
                target="_blank"
                rel="noreferrer"
                className="btn-orange text-center"
              >
                QUERO COMPRAR
              </a>
              <Link href="/produtos" className="btn-outline text-center">Ver mais produtos</Link>
            </div>

            <div className="text-xs text-brown/50 pt-2">
              Dúvidas? Ligue: <span className="text-brown font-medium">{settings.contact.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
