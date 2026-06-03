"use client";

import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";
import type { SiteSettings } from "@/lib/types";

export default function DestaqueEditor({ initial }: { initial: SiteSettings["highlight"] }) {
  return (
    <SectionEditor<SiteSettings["highlight"]>
      initial={initial}
      save={(v) => saveSection("highlight", v)}
    >
      {(s, set) => (
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Tag (ex: DESTAQUE)"><input className={inputCls} value={s.tag} onChange={(e) => set({ tag: e.target.value })} /></Field>
          <Field label="Título (ex: Novidade)"><input className={inputCls} value={s.title} onChange={(e) => set({ title: e.target.value })} /></Field>
          <Field label="Subtítulo"><input className={inputCls} value={s.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></Field>
          <Field label="Imagem (URL)"><input className={inputCls} value={s.image} onChange={(e) => set({ image: e.target.value })} /></Field>
          <div className="md:col-span-2">
            <Field label="Corpo" hint="Separe parágrafos com linha em branco.">
              <textarea className={inputCls + " min-h-[200px]"} value={s.body} onChange={(e) => set({ body: e.target.value })} />
            </Field>
          </div>
        </div>
      )}
    </SectionEditor>
  );
}
