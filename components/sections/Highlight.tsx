import type { SiteSettings } from "@/lib/types";

export default function Highlight({ settings }: { settings: SiteSettings }) {
  const h = settings.highlight;
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-12 h-1.5 bg-orange" />
            <span className="text-xs tracking-widest font-semibold text-brown">{h.tag}</span>
          </div>
          <div className="border-t border-brown/30 pt-8">
            <h2 className="font-display text-5xl text-brown">{h.title}</h2>
            <p className="font-display text-2xl text-brown/80 mt-2">{h.subtitle}</p>
          </div>
          <div className="mt-6 space-y-4 text-sm text-brown/85 leading-relaxed">
            {h.body.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div className="aspect-[4/5] w-full overflow-hidden bg-brown-dark">
          <img src={h.image} alt={h.subtitle} className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}
