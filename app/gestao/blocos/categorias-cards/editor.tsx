"use client";

import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import { saveSection } from "@/app/gestao/settings-actions";
import type { SiteSettings } from "@/lib/types";

export default function CategoriasCardsEditor({ initial }: { initial: SiteSettings["categoriesIntro"] }) {
  return (
    <SectionEditor<SiteSettings["categoriesIntro"]>
      initial={initial}
      save={(v) => saveSection("categoriesIntro", v)}
    >
      {(s, set) => (
        <div className="grid gap-4">
          <Field label="Título (opcional)"><input className={inputCls} value={s.title} onChange={(e) => set({ title: e.target.value })} /></Field>
          <Field label="Subtítulo (opcional)"><input className={inputCls} value={s.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></Field>
        </div>
      )}
    </SectionEditor>
  );
}
