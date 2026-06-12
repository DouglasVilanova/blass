import Link from "next/link";
import { Star } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { productAttrs } from "@/lib/attributes";
import AdminProductOverlay from "./AdminProductOverlay";

export default function ProductCard({
  product,
  category,
  isAdmin = false,
}: {
  product: Product;
  category?: Category;
  isAdmin?: boolean;
}) {
  const attrValues = productAttrs(product).flatMap((a) => a.values);
  return (
    <Link
      href={`/produtos/${product.category}/${product.slug}`}
      className="group relative flex flex-col bg-white border border-brown/10 hover:border-orange hover:shadow-lg transition-all duration-200"
    >
      {/* Admin overlay — only visible on hover when admin */}
      {isAdmin && (
        <AdminProductOverlay productId={product.id} productName={product.name} />
      )}

      {/* Imagem */}
      <div className="relative aspect-square overflow-hidden bg-cream-dark">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brown/20">
            <span className="text-4xl font-display tracking-widest opacity-30">B</span>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-orange text-white text-[10px] tracking-widest px-2 py-1 font-semibold">
            <Star className="w-2.5 h-2.5 fill-white" /> DESTAQUE
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        {category && (
          <div className="text-[10px] tracking-widest text-orange font-semibold uppercase">
            {category.name}
          </div>
        )}
        <h3 className="font-semibold text-brown leading-tight group-hover:text-orange transition-colors">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="text-xs text-brown/60 line-clamp-2 mt-0.5">
            {product.shortDescription}
          </p>
        )}
        {attrValues.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {attrValues.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 bg-cream-dark text-brown/60">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto pt-3 text-xs font-semibold tracking-wider text-orange group-hover:gap-2 flex items-center gap-1 transition-all">
          Ver produto <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
