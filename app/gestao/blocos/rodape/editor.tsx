"use client";

import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import { saveSection } from "@/app/gestao/settings-actions";
import type { SiteSettings } from "@/lib/types";

export default function RodapeEditor({ initial }: { initial: SiteSettings["contact"] }) {
  return (
    <SectionEditor<SiteSettings["contact"]>
      initial={initial}
      save={(v) => saveSection("contact", v)}
    >
      {(s, set) => (
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Telefone (exibição)"><input className={inputCls} value={s.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
          <Field label="Telefone (dígitos para WhatsApp)"><input className={inputCls} value={s.phoneDigits} onChange={(e) => set({ phoneDigits: e.target.value })} /></Field>
          <Field label="E-mail"><input className={inputCls} value={s.email} onChange={(e) => set({ email: e.target.value })} /></Field>
          <Field label="Endereço"><input className={inputCls} value={s.address} onChange={(e) => set({ address: e.target.value })} /></Field>
          <Field label="Instagram (URL)"><input className={inputCls} value={s.instagram} onChange={(e) => set({ instagram: e.target.value })} /></Field>
          <Field label="Facebook (URL)"><input className={inputCls} value={s.facebook} onChange={(e) => set({ facebook: e.target.value })} /></Field>
          <Field label="LinkedIn (URL)"><input className={inputCls} value={s.linkedin} onChange={(e) => set({ linkedin: e.target.value })} /></Field>
        </div>
      )}
    </SectionEditor>
  );
}
