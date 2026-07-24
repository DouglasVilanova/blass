"use client";

import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";
import type { SiteSeo } from "@/lib/types";

export default function SeoEditor({ initial }: { initial: SiteSeo }) {
  return (
    <SectionEditor<SiteSeo>
      initial={initial}
      save={(v) => saveSection("seo", v)}
    >
      {(s, set) => (
        <div className="grid gap-6">
          {/* Verificação de propriedade — renderizada no servidor (o robô lê no HTML bruto). */}
          <div className="rounded-lg border border-brown/15 bg-cream-dark/30 p-4 grid gap-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-brown/60">
              Verificação de propriedade (server-side)
            </div>
            <p className="text-xs text-brown/50 -mt-2">
              Cole aqui o código de verificação. Pode colar a tag <code>&lt;meta&gt;</code> inteira ou só o
              conteúdo — o site injeta no <code>&lt;head&gt;</code> pelo servidor, então o Google/Bing enxerga
              (diferente do campo “Head” abaixo, que é carregado por JavaScript).
            </p>
            <Field label="Google Search Console" hint='Ex.: <meta name="google-site-verification" content="XXXX" /> — ou só o XXXX.'>
              <input className={inputCls + " font-mono text-xs"} value={s.verification?.google ?? ""} onChange={(e) => set({ verification: { ...s.verification, google: e.target.value } })} />
            </Field>
            <Field label="Bing Webmaster (opcional)" hint="msvalidate.01 — cole a tag ou só o código.">
              <input className={inputCls + " font-mono text-xs"} value={s.verification?.bing ?? ""} onChange={(e) => set({ verification: { ...s.verification, bing: e.target.value } })} />
            </Field>
            <Field label="Facebook / Meta Domain (opcional)" hint="facebook-domain-verification — cole a tag ou só o código.">
              <input className={inputCls + " font-mono text-xs"} value={s.verification?.facebook ?? ""} onChange={(e) => set({ verification: { ...s.verification, facebook: e.target.value } })} />
            </Field>
          </div>

          <Field label="Head (injetado em <head> via JavaScript)" hint="Para scripts: Google Analytics, GTM, Meta Pixel. NÃO use para verificação de propriedade — use os campos acima.">
            <textarea className={inputCls + " font-mono text-xs min-h-[200px]"} value={s.head} onChange={(e) => set({ head: e.target.value })} />
          </Field>
          <Field label="Body start (injetado logo após <body>)" hint="Use para noscript do GTM.">
            <textarea className={inputCls + " font-mono text-xs min-h-[160px]"} value={s.bodyStart} onChange={(e) => set({ bodyStart: e.target.value })} />
          </Field>
        </div>
      )}
    </SectionEditor>
  );
}
