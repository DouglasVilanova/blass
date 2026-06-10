"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ROTATE_MS = 6000;

export default function HeroCarousel({ banners }: { banners: string[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const startedAt = useRef<number>(Date.now());
  const total = banners.length;

  const goTo = useCallback((i: number) => {
    setIdx(((i % total) + total) % total);
    startedAt.current = Date.now();
    setProgress(0);
  }, [total]);

  const next = useCallback(() => goTo(idx + 1), [idx, goTo]);
  const prev = useCallback(() => goTo(idx - 1), [idx, goTo]);

  // Auto-rotate + progress bar tick
  useEffect(() => {
    if (total <= 1) return;
    startedAt.current = Date.now();
    setProgress(0);

    const tick = setInterval(() => {
      if (paused) {
        startedAt.current = Date.now() - (progress / 100) * ROTATE_MS;
        return;
      }
      const elapsed = Date.now() - startedAt.current;
      const pct = (elapsed / ROTATE_MS) * 100;
      if (pct >= 100) {
        setIdx((i) => (i + 1) % total);
        startedAt.current = Date.now();
        setProgress(0);
      } else {
        setProgress(pct);
      }
    }, 50);

    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, total, idx]);

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

  return (
    <section
      className="relative w-full overflow-hidden bg-brown-dark"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides — imagem fantasma define altura natural; slides empilhados com fade */}
      <div className="relative w-full">
        {/* Fantasma: primeira imagem em fluxo normal (invisible) define a altura do container */}
        <img
          src={banners[0]}
          aria-hidden
          fetchPriority="high"
          className="w-full h-auto invisible block"
        />

        {/* Todas as imagens absolutas sobre o fantasma */}
        {banners.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt=""
            aria-hidden
            fetchPriority={i === 0 ? "high" : "low"}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Setas */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Banner anterior"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-brown/40 hover:bg-orange text-cream-light flex items-center justify-center transition-colors backdrop-blur-sm z-10"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={next}
              aria-label="Próximo banner"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-brown/40 hover:bg-orange text-cream-light flex items-center justify-center transition-colors backdrop-blur-sm z-10"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}
      </div>

      {/* Barra de rolagem (progress) */}
      {total > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-10">
          {/* Trilho */}
          <div className="h-1 bg-cream-light/15 backdrop-blur-sm" />

          {/* Indicadores divididos por banner */}
          <div className="absolute bottom-0 left-0 right-0 flex">
            {banners.map((_, i) => {
              const isActive = i === idx;
              const isPast = i < idx;
              const fillPct = isActive ? progress : isPast ? 100 : 0;
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Ir para banner ${i + 1}`}
                  className="flex-1 h-1 relative group hover:h-1.5 transition-all"
                >
                  <div
                    className="absolute inset-0 bg-orange origin-left transition-transform"
                    style={{ transform: `scaleX(${fillPct / 100})` }}
                  />
                </button>
              );
            })}
          </div>

          {/* Contador */}
          <div className="absolute bottom-3 right-4 text-[10px] tracking-widest text-cream-light/70 font-semibold">
            {idx + 1} / {total}
          </div>
        </div>
      )}
    </section>
  );
}
