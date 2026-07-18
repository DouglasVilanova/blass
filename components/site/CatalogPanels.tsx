import Link from "next/link";

export type Panel = {
  label: string;
  href: string;
  image?: string;
};

/**
 * Painéis fotográficos verticais (estilo referência GOURMET/SALAS/DORMITÓRIOS):
 * foto cobrindo o card inteiro + nome centralizado sobreposto, hover com zoom.
 * Usado na intro do catálogo (categorias) e na escolha de subcategorias.
 */
export default function CatalogPanels({ panels, tall = true }: { panels: Panel[]; tall?: boolean }) {
  return (
    <div
      className={`grid gap-3 md:gap-4 ${
        panels.length <= 2
          ? "grid-cols-1 sm:grid-cols-2"
          : panels.length === 3
          ? "grid-cols-1 sm:grid-cols-3"
          : "grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {panels.map((p) => (
        <Link
          key={p.href + p.label}
          href={p.href}
          className={`group relative block overflow-hidden rounded-2xl bg-brown ${
            tall ? "h-[clamp(320px,60vh,640px)]" : "h-[clamp(220px,34vh,380px)]"
          }`}
          aria-label={`Ver ${p.label}`}
        >
          {p.image ? (
            <img
              src={p.image}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brown via-brown-mid to-brown-dark" />
          )}

          {/* Escurece levemente para leitura do nome */}
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />

          {/* Nome centralizado */}
          <span className="absolute inset-0 flex items-center justify-center px-4">
            <span className="font-exo font-semibold uppercase tracking-[0.18em] text-white text-center text-sm md:text-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {p.label}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
