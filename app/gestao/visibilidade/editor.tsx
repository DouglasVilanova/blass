"use client";

import SectionEditor from "@/components/gestao/SectionEditor";
import { saveSection } from "@/app/gestao/settings-actions";
import type { SiteVisibility } from "@/lib/types";

const TOGGLES: { key: keyof SiteVisibility; label: string; description: string }[] = [
  { key: "stats", label: "Estatísticas", description: "Faixa com 26 anos / 2000+ revendas / mapa." },
  { key: "tagline", label: "Faixa Tagline", description: "Imagem da cozinha + frase + CTA." },
  { key: "highlight", label: "Destaque", description: "Bloco 'Novidade' com produto em foco." },
  { key: "reach", label: "CTA Reach", description: "Seção marrom com mapa e botão QUERO COMPRAR." },
];

export default function VisibilidadeEditor({ initial }: { initial: SiteVisibility }) {
  return (
    <SectionEditor<SiteVisibility>
      initial={initial}
      save={(v) => saveSection("visibility", v)}
    >
      {(s, set) => (
        <div className="divide-y divide-brown/10">
          {TOGGLES.map(({ key, label, description }) => (
            <label key={key} className="flex items-start gap-4 py-4 cursor-pointer">
              <input
                type="checkbox"
                checked={s[key]}
                onChange={(e) => set({ [key]: e.target.checked } as Partial<SiteVisibility>)}
                className="mt-1 accent-orange w-4 h-4"
              />
              <div>
                <div className="font-semibold text-brown">{label}</div>
                <div className="text-sm text-brown/60">{description}</div>
              </div>
            </label>
          ))}
        </div>
      )}
    </SectionEditor>
  );
}
