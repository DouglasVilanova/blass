import Image from "next/image";
import Reveal from "@/components/Reveal";
import { DEFAULT_STORE } from "@/lib/defaults";

function renderBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-bold">{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export default function Tendencias({
  text,
  highlight,
  image,
}: {
  text?: string;
  highlight?: string;
  image?: string;
}) {
  const d = DEFAULT_STORE.settings.tendencias;
  const t = text ?? d.text;
  const h = highlight ?? d.highlight;
  const img = image || d.image;

  return (
    <section className="relative overflow-hidden bg-night-deep">
      <Image src={img} alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-night-deep/55" />

      <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-16 text-center">
        <Reveal variant="up-far">
          <h2 className="font-exo text-cream-light text-xl md:text-3xl lg:text-[2rem] font-medium leading-snug drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            {renderBold(t)}{" "}
            <span className="text-orange font-bold">{h}</span>
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
