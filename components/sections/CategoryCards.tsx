import Link from "next/link";
import { Lamp, Wrench, ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  lamp: Lamp,
  wrench: Wrench,
};

export default function CategoryCards({ categories, intro }: { categories: Category[]; intro?: { title?: string; subtitle?: string } }) {
  return (
    <section className="relative bg-brown py-20 pattern-zigzag">
      <div className="mx-auto max-w-5xl px-6">
        {(intro?.title || intro?.subtitle) && (
          <div className="text-center mb-14 text-cream-light">
            {intro.title && <h2 className="font-display text-3xl">{intro.title}</h2>}
            {intro.subtitle && <p className="text-cream-light/80 mt-2 max-w-2xl mx-auto">{intro.subtitle}</p>}
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((cat) => {
            const Icon = ICONS[cat.icon ?? "lamp"] ?? Lamp;
            return (
              <div key={cat.slug} className="relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-orange flex items-center justify-center shadow-lg">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="border border-orange/60 bg-brown-mid/60 px-8 pt-14 pb-8 text-center text-cream-light">
                  <h3 className="font-semibold tracking-widest text-sm uppercase">{cat.name}</h3>
                  <p className="mt-4 text-sm text-cream-light/85 leading-relaxed min-h-[80px]">{cat.description}</p>
                  <Link href={`/produtos/${cat.slug}`} className="mt-6 inline-flex items-center gap-2 text-xs tracking-wider text-orange hover:text-orange-light">
                    Ver produtos <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
