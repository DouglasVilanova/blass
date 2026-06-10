"use client";

import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import ImageUpload from "@/components/gestao/ImageUpload";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";
import type { SiteSettings } from "@/lib/types";

export default function DestaqueEditor({ initial }: { initial: SiteSettings["highlight"] }) {
  return (
    <SectionEditor<SiteSettings["highlight"]>
      initial={initial}
      save={(v) => saveSection("highlight", v)}
    >
      {(s, set) => (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Tag (ex: DESTAQUE)">
              <input className={inputCls} value={s.tag} onChange={(e) => set({ tag: e.target.value })} />
            </Field>
            <Field label="Título (ex: Novidade)">
              <input className={inputCls} value={s.title} onChange={(e) => set({ title: e.target.value })} />
            </Field>
            <Field label="Subtítulo">
              <input className={inputCls} value={s.subtitle} onChange={(e) => set({ subtitle: e.target.value })} />
            </Field>
            <div />
            <div className="md:col-span-2">
              <Field label="Corpo" hint="Separe parágrafos com linha em branco.">
                <textarea className={inputCls + " min-h-[200px]"} value={s.body} onChange={(e) => set({ body: e.target.value })} />
              </Field>
            </div>
          </div>

          <ImageUpload
            label="Imagem do destaque"
            value={s.image}
            onChange={(url) => set({ image: url })}
            folder="site"
            aspect="portrait"
            recommended="800 × 1000 px (retrato 4:5)"
            hint="Foto do produto em destaque. Exibida ao lado direito do texto."
          />
        </div>
      )}
    </SectionEditor>
  );
}
