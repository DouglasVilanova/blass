"use client";

import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import { saveSection } from "@/app/gestao/settings-actions";
import type { SiteSettings } from "@/lib/types";

export default function SobreEditor({ initial }: { initial: SiteSettings["about"] }) {
  return (
    <SectionEditor<SiteSettings["about"]>
      initial={initial}
      save={(v) => saveSection("about", v)}
    >
      {(s, set) => (
        <Field label="Parágrafos" hint="Separe parágrafos com linha em branco. Use **negrito** para realce.">
          <textarea
            className={inputCls + " min-h-[260px]"}
            value={s.paragraphs.join("\n\n")}
            onChange={(e) => set({ paragraphs: e.target.value.split("\n\n").filter(Boolean) })}
          />
        </Field>
      )}
    </SectionEditor>
  );
}
