import type { SiteSettings } from "@/lib/types";

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-brown">{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export default function About({ settings }: { settings: SiteSettings }) {
  return (
    <section id="sobre" className="bg-cream py-20">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-[1fr_2fr] gap-10 items-center">
        <div className="flex justify-center md:justify-start">
          <div className="text-center">
            <div className="font-display text-5xl tracking-[0.25em] text-brown">BLASS</div>
            <div className="text-[10px] tracking-[0.3em] text-orange mt-2">ILUMINAÇÃO • COMPONENTES</div>
          </div>
        </div>
        <div className="space-y-5 text-brown/85 leading-relaxed">
          {settings.about.paragraphs.map((p, i) => (
            <p key={i}>{renderBold(p)}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
