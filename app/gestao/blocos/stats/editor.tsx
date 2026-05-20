"use client";

import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import { saveSection } from "@/app/gestao/settings-actions";
import type { SiteSettings } from "@/lib/types";

export default function StatsEditor({ initial }: { initial: SiteSettings["stats"] }) {
  return (
    <SectionEditor<SiteSettings["stats"]>
      initial={initial}
      save={(v) => saveSection("stats", v)}
    >
      {(s, set) => (
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Anos no mercado"><input className={inputCls} value={s.years} onChange={(e) => set({ years: e.target.value })} /></Field>
          <Field label="Revendas"><input className={inputCls} value={s.resellers} onChange={(e) => set({ resellers: e.target.value })} /></Field>
          <Field label="Cobertura"><input className={inputCls} value={s.coverage} onChange={(e) => set({ coverage: e.target.value })} /></Field>
        </div>
      )}
    </SectionEditor>
  );
}
