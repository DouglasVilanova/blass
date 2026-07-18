"use client";

import { Plus, X } from "lucide-react";
import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";
import type { SiteSettings } from "@/lib/types";

/** Lista de inputs com "+ Adicionar" e remover — usada p/ telefones, WhatsApps e e-mails */
function ListInputs({
  label,
  hint,
  values,
  placeholder,
  onChange,
  addLabel,
}: {
  label: string;
  hint: string;
  values: string[];
  placeholder: string;
  onChange: (v: string[]) => void;
  addLabel: string;
}) {
  const setAt = (i: number, v: string) => onChange(values.map((p, idx) => (idx === i ? v : p)));
  return (
    <div>
      <label className="block text-xs tracking-widest text-brown/70 font-semibold uppercase mb-1">{label}</label>
      <p className="text-[11px] text-brown/50 mb-2">{hint}</p>
      <div className="space-y-2">
        {values.map((p, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={inputCls + " flex-1"}
              value={p}
              onChange={(e) => setAt(i, e.target.value)}
              placeholder={placeholder}
            />
            {values.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(values.filter((_, idx) => idx !== i))}
                className="border border-brown/20 px-2 rounded text-brown/50 hover:text-red-600 hover:border-red-400"
                aria-label={`Remover ${label} ${i + 1}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="text-xs text-orange hover:underline inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> {addLabel}
        </button>
      </div>
    </div>
  );
}

/** Converte <br> digitado em quebra de linha real */
function normalizeAddress(v: string): string {
  return v.replace(/<\/?br\s*\/?>/gi, "\n");
}

export default function RodapeEditor({ initial }: { initial: SiteSettings["contact"] }) {
  // Migra os campos legados (string única) para listas na primeira edição
  const start = {
    ...initial,
    phones: initial.phones?.length ? initial.phones : initial.phone ? [initial.phone] : [""],
    whatsapps: initial.whatsapps?.length ? initial.whatsapps : initial.phoneDigits ? [initial.phoneDigits] : [""],
    emails: initial.emails?.length ? initial.emails : initial.email ? [initial.email] : [""],
    address: normalizeAddress(initial.address),
  };

  return (
    <SectionEditor<SiteSettings["contact"]>
      initial={start}
      save={(v) => {
        const clean = (list?: string[]) => (list ?? []).map((p) => p.trim()).filter(Boolean);
        const phones = clean(v.phones);
        const whatsapps = clean(v.whatsapps);
        const emails = clean(v.emails);
        return saveSection("contact", {
          ...v,
          phones,
          whatsapps,
          emails,
          address: normalizeAddress(v.address).trim(),
          // Campos legados sincronizados com o primeiro item (usados nos CTAs)
          phone: phones[0] ?? "",
          phoneDigits: whatsapps[0] ?? "",
          email: emails[0] ?? "",
        });
      }}
    >
      {(s, set) => (
        <div className="grid md:grid-cols-2 gap-x-4 gap-y-6">
          <ListInputs
            label="Telefones (exibição)"
            hint="Um número por campo. Aparecem no rodapé, um por linha. Ex: (54) 3022-9600"
            values={s.phones ?? [""]}
            placeholder="(54) 99999-9999"
            onChange={(phones) => set({ phones })}
            addLabel="Adicionar telefone"
          />

          <ListInputs
            label="WhatsApp (com DDD)"
            hint="O PRIMEIRO número é o principal — abre nos botões de WhatsApp do site. Pode digitar com ou sem formatação. Ex: 54 99999-9999"
            values={s.whatsapps ?? [""]}
            placeholder="54 99999-9999"
            onChange={(whatsapps) => set({ whatsapps })}
            addLabel="Adicionar WhatsApp"
          />

          <ListInputs
            label="E-mails"
            hint="Um e-mail por campo. Aparecem no rodapé, um por linha. Ex: sac@blass.ind.br"
            values={s.emails ?? [""]}
            placeholder="contato@blass.ind.br"
            onChange={(emails) => set({ emails })}
            addLabel="Adicionar e-mail"
          />

          <Field
            label="Endereço"
            hint="Pressione Enter para quebrar a linha (cada linha aparece separada no rodapé)."
          >
            <textarea
              className={inputCls + " min-h-[90px]"}
              value={s.address}
              onChange={(e) => set({ address: e.target.value })}
              placeholder={"Rua Milano, 1804\nFlores da Cunha — RS, 95270-000"}
            />
          </Field>

          <Field label="Instagram (URL)" hint="Link completo. Ex: https://instagram.com/blass">
            <input className={inputCls} value={s.instagram} onChange={(e) => set({ instagram: e.target.value })} />
          </Field>
          <Field label="Facebook (URL)" hint="Link completo. Ex: https://facebook.com/blass">
            <input className={inputCls} value={s.facebook} onChange={(e) => set({ facebook: e.target.value })} />
          </Field>
          <Field label="LinkedIn (URL)" hint="Link completo. Ex: https://linkedin.com/company/blass">
            <input className={inputCls} value={s.linkedin} onChange={(e) => set({ linkedin: e.target.value })} />
          </Field>
        </div>
      )}
    </SectionEditor>
  );
}
