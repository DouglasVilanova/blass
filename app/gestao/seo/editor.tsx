"use client";

import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import { saveSection } from "@/app/gestao/settings-actions";
import type { SiteSeo } from "@/lib/types";

export default function SeoEditor({ initial }: { initial: SiteSeo }) {
  return (
    <SectionEditor<SiteSeo>
      initial={initial}
      save={(v) => saveSection("seo", v)}
    >
      {(s, set) => (
        <div className="grid gap-6">
          <Field label="Head (injetado em <head>)" hint="Cole tags <meta>, <script>, <link>… aqui.">
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
