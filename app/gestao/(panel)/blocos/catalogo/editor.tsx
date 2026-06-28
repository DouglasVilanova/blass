"use client";

import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";
import type { SiteSettings } from "@/lib/types";

export default function CatalogoEditor({ initial }: { initial: SiteSettings["catalogo"] }) {
  return (
    <SectionEditor<SiteSettings["catalogo"]>
      initial={initial}
      save={(v) => saveSection("catalogo", v)}
    >
      {(s, set) => (
        <div className="max-w-2xl space-y-5">
          <Field label="Etiqueta (em laranja)" hint='Texto pequeno acima do título. Ex: CATÁLOGO'>
            <input className={inputCls} value={s.tag} onChange={(e) => set({ tag: e.target.value })} />
          </Field>
          <Field label="Título" hint='Título grande da página. Ex: Todos os Produtos. (Quando o cliente filtra por categoria, mostra o nome da categoria automaticamente.)'>
            <input className={inputCls} value={s.title} onChange={(e) => set({ title: e.target.value })} />
          </Field>
          <Field label="Subtítulo" hint='Frase abaixo do título. Ex: Iluminação e componentes para móveis e ambientes.'>
            <input className={inputCls} value={s.subtitle} onChange={(e) => set({ subtitle: e.target.value })} />
          </Field>
        </div>
      )}
    </SectionEditor>
  );
}
