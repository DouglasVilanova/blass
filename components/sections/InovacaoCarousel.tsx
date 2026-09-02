"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function InovacaoCarousel({ images }: { images: string[] }) {
  const list = images.length > 0 ? images : ["/novo/carrossel.webp"];
  const [idx, setIdx] = useState(0);
  const total = list.length;

  const go = useCallback((d: number) => setIdx((i) => (i + d + total) % total), [total]);

  // Auto-rotate
  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % total), 6000);
    return () => clearInterval(id);
  }, [total]);

  return (
    <div className="relative rounded-[24px] p-[3px] bg-gradient-to-br from-[#BB581D] via-[#BB581D]/70 to-[#BB581D]/20 shadow-2xl shadow-black/40">
      <div className="relative rounded-[21px] overflow-hidden bg-night-deep">
        {/* Slides empilhados com fade */}
        <div className="relative aspect-[16/10]">
          {list.map((src, i) => (
            <Image
              key={src + i}
              src={src}
              alt=""
              aria-hidden={i !== idx}
              fill
              sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
              priority={i === 0}
              className={`object-cover transition-opacity duration-700 ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* Setas */}
        {total > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-night-deep/60 hover:bg-orange text-cream-light flex items-center justify-center backdrop-blur-sm transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Próxima imagem"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-night-deep/60 hover:bg-orange text-cream-light flex items-center justify-center backdrop-blur-sm transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {list.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Ir para imagem ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-5 bg-orange" : "w-1.5 bg-cream-light/50 hover:bg-cream-light/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
