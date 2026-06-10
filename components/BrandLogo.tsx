/**
 * Logo oficial da Blass (do Manual de Marca).
 * Usa o PNG do manual quando precisar do "/" laranja no meio do A.
 */
type Props = {
  variant?: "positivo" | "negativo";
  /** assinatura completa = logo + tagline "ILUMINAÇÃO ≡ COMPONENTES" */
  signature?: boolean;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

export default function BrandLogo({
  variant = "negativo",
  signature = false,
  className,
  width = 200,
  height = 60,
  priority,
}: Props) {
  const base = signature ? "logo-assinatura" : "logo";
  const src = `/brand/${base}-${variant}.png`;
  const alt = signature
    ? "Blass — Iluminação e Componentes"
    : "Blass";

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      className={className}
    />
  );
}
