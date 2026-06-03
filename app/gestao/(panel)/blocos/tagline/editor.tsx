"use client";

import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";
import type { SiteSettings } from "@/lib/types";

export default function TaglineEditor({ initial }: { initial: SiteSettings["tagline"] }) {
  return (
    <SectionEditor<SiteSettings["tagline"]>
      initial={initial}
      save={(v) => saveSection("tagline", v)}
    >
      {(s, set) => (
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Linha 1"><input className={inputCls} value={s.line1} onChange={(e) => set({ line1: e.target.value })} /></Field>
          <Field label="Realce 1 (laranja)"><input className={inputCls} value={s.highlight1} onChange={(e) => set({ highlight1: e.target.value })} /></Field>
          <Field label="Linha 2"><input className={inputCls} value={s.line2} onChange={(e) => set({ line2: e.target.value })} /></Field>
          <Field label="Realce 2 (laranja)"><input className={inputCls} value={s.highlight2} onChange={(e) => set({ highlight2: e.target.value })} /></Field>
          <Field label="CTA — texto"><input className={inputCls} value={s.ctaLabel} onChange={(e) => set({ ctaLabel: e.target.value })} /></Field>
          <Field label="CTA — link"><input className={inputCls} value={s.ctaHref} onChange={(e) => set({ ctaHref: e.target.value })} /></Field>
          <div className="md:col-span-2"><Field label="Imagem (URL)"><input className={inputCls} value={s.image} onChange={(e) => set({ image: e.target.value })} /></Field></div>
        </div>
      )}
    </SectionEditor>
  );
}
