"use client";

import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import { saveSection } from "@/app/gestao/settings-actions";
import type { SiteSettings } from "@/lib/types";

export default function HeroEditor({ initial }: { initial: SiteSettings["hero"] }) {
  return (
    <SectionEditor<SiteSettings["hero"]>
      initial={initial}
      save={(v) => saveSection("hero", v)}
    >
      {(s, set) => (
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Título"><input className={inputCls} value={s.title} onChange={(e) => set({ title: e.target.value })} /></Field>
          <Field label="Subtítulo"><input className={inputCls} value={s.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></Field>
          <div className="md:col-span-2"><Field label="Imagem (URL)" hint="Use /images/... ou URL https"><input className={inputCls} value={s.image} onChange={(e) => set({ image: e.target.value })} /></Field></div>
        </div>
      )}
    </SectionEditor>
  );
}
