"use client";

import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import { saveSection } from "@/app/gestao/settings-actions";
import type { SiteSettings } from "@/lib/types";

export default function MenuEditor({ initial }: { initial: SiteSettings["contact"] }) {
  return (
    <SectionEditor<SiteSettings["contact"]>
      initial={initial}
      save={(v) => saveSection("contact", v)}
    >
      {(s, set) => (
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Telefone exibido no topo"><input className={inputCls} value={s.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
          <Field label="Instagram"><input className={inputCls} value={s.instagram} onChange={(e) => set({ instagram: e.target.value })} /></Field>
          <Field label="Facebook"><input className={inputCls} value={s.facebook} onChange={(e) => set({ facebook: e.target.value })} /></Field>
          <Field label="LinkedIn"><input className={inputCls} value={s.linkedin} onChange={(e) => set({ linkedin: e.target.value })} /></Field>
        </div>
      )}
    </SectionEditor>
  );
}
