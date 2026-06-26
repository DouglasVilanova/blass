"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "fade" | "up" | "left" | "right" | "up-far" | "left-far" | "right-far";

const ANIM: Record<Variant, string> = {
  fade: "animate-reveal-fade",
  up: "animate-reveal-up",
  left: "animate-reveal-left",
  right: "animate-reveal-right",
  "up-far": "animate-reveal-up-far",
  "left-far": "animate-reveal-left-far",
  "right-far": "animate-reveal-right-far",
};

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  /** atraso da animação em ms */
  delay?: number;
  className?: string;
};

/**
 * Anima a entrada do conteúdo. Se já estiver visível no carregamento (ex: Hero),
 * dispara na hora; senão, ao rolar até ele (IntersectionObserver).
 */
export default function Reveal({ children, variant = "fade", delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    // Dispara só quando o bloco entra de fato na tela (rootMargin encolhe a borda
    // inferior em 15% → começa quando o usuário "chega" no bloco ao rolar).
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={`${shown ? ANIM[variant] : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
