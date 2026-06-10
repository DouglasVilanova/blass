/**
 * Mapa do Brasil — usa PNG oficial em /public/brand/brasil.png.
 *
 * - `variant="outline"` → renderiza o PNG original (contorno laranja oficial)
 * - `variant="fill"` → usa CSS mask para preencher a silhueta com a cor atual
 *   (controlada via `text-*` do Tailwind no className)
 */
type Props = {
  className?: string;
  variant?: "fill" | "outline";
};

export default function BrazilOutline({
  className = "",
  variant = "outline",
}: Props) {
  if (variant === "fill") {
    return (
      <span
        aria-hidden
        className={`inline-block bg-current ${className}`}
        style={{
          WebkitMaskImage: "url(/brand/brasil.png)",
          maskImage: "url(/brand/brasil.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    );
  }

  return (
    <img
      src="/brand/brasil.png"
      alt=""
      aria-hidden
      className={className}
    />
  );
}
