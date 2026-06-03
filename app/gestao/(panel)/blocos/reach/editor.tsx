"use client";

import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";
import type { SiteSettings } from "@/lib/types";

export default function ReachEditor({ initial }: { initial: SiteSettings["reach"] }) {
  return (
    <SectionEditor<SiteSettings["reach"]>
      initial={initial}
      save={(v) => saveSection("reach", v)}
    >
      {(s, set) => (
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Título"><input className={inputCls} value={s.title} onChange={(e) => set({ title: e.target.value })} /></Field>
          <Field label="CTA — texto"><input className={inputCls} value={s.ctaLabel} onChange={(e) => set({ ctaLabel: e.target.value })} /></Field>
          <Field label="CTA — link"><input className={inputCls} value={s.ctaHref} onChange={(e) => set({ ctaHref: e.target.value })} /></Field>
          <div />
          <div className="md:col-span-2">
            <Field label="Corpo"><textarea className={inputCls + " min-h-[100px]"} value={s.body} onChange={(e) => set({ body: e.target.value })} /></Field>
          </div>
        </div>
      )}
    </SectionEditor>
  );
}
