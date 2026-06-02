"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export default function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-cream-dark border border-brown/10 flex items-center justify-center text-brown/20">
        <span className="font-display text-6xl tracking-widest opacity-30">B</span>
      </div>
    );
  }

  function prev() { setActive((i) => (i - 1 + images.length) % images.length); }
  function next() { setActive((i) => (i + 1) % images.length); }

  return (
    <div className="space-y-3 sticky top-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden bg-cream-dark border border-brown/10 group cursor-zoom-in" onClick={() => setLightbox(true)}>
        <img
          src={images[active]}
          alt={`${productName} — foto ${active + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-brown/70 text-white p-1.5 rounded">
          <ZoomIn className="w-4 h-4" />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brown p-1.5 shadow transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brown p-1.5 shadow transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActive(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === active ? "bg-orange w-4" : "bg-white/70"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-all ${i === active ? "border-orange" : "border-transparent hover:border-brown/30"}`}
            >
              <img src={src} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img
            src={images[active]}
            alt={productName}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute top-4 right-4 text-white/60 text-sm">
            {active + 1} / {images.length} — clique fora para fechar
          </div>
        </div>
      )}
    </div>
  );
}
