import type { SiteLayouts } from "@/lib/types";
import Reveal from "@/components/Reveal";

type Layout = SiteLayouts["construimos"];

/**
 * Card do bloco "A Blass que construímos" — 3 camadas posicionáveis:
 * prédio (com zoom), mão e brilho. Usado tanto no site quanto no editor
 * do painel, garantindo que o preview seja idêntico ao resultado final.
 * `animate` liga as animações de entrada (desligado no editor).
 */
export default function ConstruimosCard({ layout, animate = true }: { layout: Layout; animate?: boolean }) {
  const { predioZoom, mao, brilho } = layout;

  const layerStyle = (l: { x: number; y: number; w: number }): React.CSSProperties => ({
    position: "absolute",
    left: `${l.x}%`,
    top: `${l.y}%`,
    width: `${l.w}%`,
    transform: "translate(-50%, -50%)",
  });

  // Prédio (card com borda degradê)
  const card = (
    <div className="rounded-[30px] p-[3px] bg-gradient-to-br from-[#BB581D] via-[#BB581D]/70 to-[#BB581D]/20 shadow-2xl shadow-black/40">
      <div className="rounded-[27px] overflow-hidden relative">
        <img
          src="/novo/predio.webp"
          alt="Pavilhão da Blass em Flores da Cunha"
          className="w-full h-auto block origin-center"
          style={{ transform: `scale(${predioZoom})` }}
          loading="lazy"
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none rounded-[27px]"
          style={{ boxShadow: "inset 0 0 55px 12px rgba(20,11,5,0.7)" }}
        />
      </div>
    </div>
  );

  // Mão + brilho (só md+ pra não bagunçar no mobile)
  const layers = (
    <>
      <img
        src="/novo/brilho.webp"
        alt=""
        aria-hidden
        className="hidden md:block pointer-events-none mix-blend-screen z-10"
        style={layerStyle(brilho)}
      />
      <img
        src="/novo/mao.webp"
        alt=""
        aria-hidden
        className="hidden md:block pointer-events-none z-20 drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
        style={layerStyle(mao)}
      />
    </>
  );

  return (
    <div className="relative">
      {/* Prédio entra deslizando da esquerda (distância longa) */}
      {animate ? <Reveal variant="left-far">{card}</Reveal> : card}

      {/* Mão + brilho sobem de baixo (distância longa) */}
      {animate ? (
        <Reveal variant="up-far" delay={250} className="absolute inset-0 pointer-events-none">
          {layers}
        </Reveal>
      ) : (
        <div className="absolute inset-0 pointer-events-none">{layers}</div>
      )}
    </div>
  );
}
