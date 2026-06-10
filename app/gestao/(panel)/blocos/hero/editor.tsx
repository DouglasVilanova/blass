"use client";

import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import ImageUpload from "@/components/gestao/ImageUpload";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";
import type { SiteSettings } from "@/lib/types";

export default function HeroEditor({ initial }: { initial: SiteSettings["hero"] }) {
  return (
    <SectionEditor<SiteSettings["hero"]>
      initial={initial}
      save={(v) => saveSection("hero", v)}
    >
      {(s, set) => (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Título">
              <input className={inputCls} value={s.title} onChange={(e) => set({ title: e.target.value })} />
            </Field>
            <Field label="Subtítulo">
              <input className={inputCls} value={s.subtitle} onChange={(e) => set({ subtitle: e.target.value })} />
            </Field>
          </div>

          <ImageUpload
            label="Imagem de fundo do Hero"
            value={s.image}
            onChange={(url) => set({ image: url })}
            folder="site"
            aspect="wide"
            recommended="1920 × 1080 px (paisagem 16:9)"
            hint="Foto da fachada/ambiente. Exibida com overlay escuro atrás do logo BLASS."
          />
        </div>
      )}
    </SectionEditor>
  );
}
