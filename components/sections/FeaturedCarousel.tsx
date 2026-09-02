"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";

export default function FeaturedCarousel({
  products,
  tag: _tag,
}: {
  products: Product[];
  tag?: string;
}) {
  const [idx, setIdx] = useState(0);
  const total = products.length;

  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => {
      const el = document.getElementById("novidades");
      if (el?.dataset.paused === "true") return;
      setIdx((i) => (i + 1) % total);
    }, 9000);
    return () => clearInterval(id);
  }, [total]);

  if (total === 0) return null;

  const current = products[idx];
  const href = `/produtos/${current.category}/${current.slug}`;

  // Última palavra do nome em laranja (ex: "Fita COB 3mm" → "3mm")
  const parts = current.name.trim().split(" ");
  const lastWord = parts.length > 1 ? parts.pop() : "";
  const headWords = parts.join(" ");

  return (
    <section
      id="novidades"
      className="relative bg-[#4F2612] py-14 md:py-20 overflow-hidden"
      onMouseEnter={(e) => (e.currentTarget.dataset.paused = "true")}
      onMouseLeave={(e) => (e.currentTarget.dataset.paused = "false")}
    >
      {/* Glow laranja no topo */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-64 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top, rgba(240,120,26,0.22), transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="relative">
          {/* Card */}
          <div className="rounded-[26px] border border-orange/80 bg-brown/20 p-6 md:p-10">
            {/* Título dentro do bloco */}
            <h2 className="font-exo font-bold uppercase tracking-wide text-cream-light text-3xl md:text-5xl text-center mb-8 md:mb-10">
              Novidades
            </h2>
            <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
              {/* Texto */}
              <div>
                <h3 className="font-exo font-semibold text-cream-light text-2xl md:text-3xl">
                  {headWords} {lastWord && <span className="text-orange">{lastWord}</span>}
                </h3>
                {current.description ? (
                  <div className="mt-4 text-cream-light/75 text-sm leading-relaxed whitespace-pre-line line-clamp-[12]">
                    {current.description}
                  </div>
                ) : current.shortDescription ? (
                  <p className="mt-4 text-cream-light/75 text-sm leading-relaxed">{current.shortDescription}</p>
                ) : null}

                <Link
                  href={href}
                  className="mt-6 inline-flex items-center rounded-full border border-orange text-cream-light hover:bg-orange hover:text-white px-6 py-2.5 text-sm transition-colors"
                >
                  saiba mais clicando <strong className="font-bold ml-1">aqui!</strong>
                </Link>
              </div>

              {/* Imagem */}
              <Link
                href={href}
                className="relative block rounded-[18px] overflow-hidden border border-orange/50 aspect-[4/5] bg-night-deep group"
              >
                {current.image ? (
                  <Image
                    key={current.image}
                    src={current.image}
                    alt={current.name}
                    fill
                    sizes="(min-width: 1280px) 520px, (min-width: 768px) 40vw, 90vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-cream-light/20 font-exo text-9xl">B</div>
                )}
              </Link>
            </div>
          </div>

          {/* Setas */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Anterior"
                className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream-light/90 hover:bg-orange text-orange hover:text-white flex items-center justify-center shadow-lg shadow-black/30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                aria-label="Próximo"
                className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream-light/90 hover:bg-orange text-orange hover:text-white flex items-center justify-center shadow-lg shadow-black/30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {total > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Novidade ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "bg-orange w-8" : "bg-cream-light/30 w-3 hover:bg-cream-light/50"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
