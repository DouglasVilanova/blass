"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { productAttrs } from "@/lib/attributes";

export default function FeaturedCarousel({
  products,
  tag = "DESTAQUE",
}: {
  products: Product[];
  tag?: string;
}) {
  const [idx, setIdx] = useState(0);
  const total = products.length;

  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total]);

  // Auto-rotate every 8s, pause on hover via [data-paused]
  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => {
      const el = document.getElementById("featured-carousel");
      if (el?.dataset.paused === "true") return;
      setIdx((i) => (i + 1) % total);
    }, 8000);
    return () => clearInterval(id);
  }, [total]);

  // Keyboard arrows
  useEffect(() => {
    if (total <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, total]);

  if (total === 0) return null;

  const current = products[idx];
  const currentAttrValues = productAttrs(current).flatMap((a) => a.values);

  return (
    <section
      id="featured-carousel"
      className="bg-cream py-20 relative overflow-hidden"
      onMouseEnter={(e) => (e.currentTarget.dataset.paused = "true")}
      onMouseLeave={(e) => (e.currentTarget.dataset.paused = "false")}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Tag header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="block w-12 h-1.5 bg-orange" />
            <span className="text-xs tracking-widest font-semibold text-brown">{tag}</span>
          </div>
          <div className="text-xs text-brown/50 tracking-widest">
            {idx + 1} / {total}
          </div>
        </div>

        {/* Slide */}
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[500px]">
          <div className="space-y-5">
            <div className="border-t border-brown/30 pt-6">
              {currentAttrValues.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {currentAttrValues.slice(0, 3).map((t) => (
                    <span key={t} className="text-[10px] tracking-widest text-orange uppercase font-semibold">
                      {t}
                    </span>
                  )).reduce<React.ReactNode[]>((acc, el, i) => i === 0 ? [el] : [...acc, <span key={`d${i}`} className="text-orange/40">·</span>, el], [])}
                </div>
              )}
              <h2 className="font-display text-5xl text-brown leading-tight">{current.name}</h2>
              {current.shortDescription && (
                <p className="font-display text-xl text-brown/70 mt-3">{current.shortDescription}</p>
              )}
            </div>

            {current.description && (
              <div className="text-sm text-brown/80 leading-relaxed whitespace-pre-line line-clamp-[10]">
                {current.description}
              </div>
            )}

            <Link
              href={`/produtos/${current.category}/${current.slug}`}
              className="inline-flex items-center gap-2 btn-orange mt-6"
            >
              Ver produto completo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Image */}
          <Link
            href={`/produtos/${current.category}/${current.slug}`}
            className="block aspect-[4/5] w-full overflow-hidden bg-brown-dark group relative"
          >
            {current.image ? (
              <img
                key={current.image}
                src={current.image}
                alt={current.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-cream-light/20 font-display text-9xl">
                B
              </div>
            )}
          </Link>
        </div>

        {/* Controls */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="w-10 h-10 border border-brown/30 hover:border-orange hover:bg-orange hover:text-white text-brown flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Produto ${i + 1}`}
                  className={`h-1.5 transition-all ${i === idx ? "bg-orange w-10" : "bg-brown/20 w-5 hover:bg-brown/40"}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Próximo"
              className="w-10 h-10 border border-brown/30 hover:border-orange hover:bg-orange hover:text-white text-brown flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
