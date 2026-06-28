"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import GalleryUpload from "@/components/gestao/GalleryUpload";
import { Field, inputCls } from "@/components/gestao/Field";
import { useToast } from "@/components/gestao/Toast";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";
import type { SiteSettings } from "@/lib/types";

function splitParas(s: string): string[] {
  return s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

export default function InovacaoEditor({ initial }: { initial: SiteSettings["inovacao"] }) {
  const { push } = useToast();
  const [images, setImages] = useState<string[]>(initial.images);
  const [title, setTitle] = useState(initial.title);
  const [paras, setParas] = useState(initial.paragraphs.join("\n\n"));
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await saveSection("inovacao", { images, title, paragraphs: splitParas(paras) });
    setSaving(false);
    if ("error" in res) push(res.error, "error");
    else push("Bloco salvo! Recarregue o site para ver.");
  }

  return (
    <div className="max-w-3xl space-y-6">
      <section className="bg-white border border-brown/10 rounded-xl p-6 space-y-4">
        <h2 className="font-exo font-bold text-lg text-brown">Texto</h2>
        <Field label="Título" hint='Use **palavra** para destacar em laranja. Ex: **INOVAÇÃO** NO SETOR MOVELEIRO'>
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Parágrafos" hint="Separe cada parágrafo com uma linha em branco. Use **texto** para destacar em laranja.">
          <textarea className={inputCls + " min-h-[200px]"} value={paras} onChange={(e) => setParas(e.target.value)} />
        </Field>
      </section>

      <section className="bg-white border border-brown/10 rounded-xl p-6">
        <h2 className="font-exo font-bold text-lg text-brown mb-1">Galeria de imagens</h2>
        <p className="text-xs text-brown/50 mb-4">
          Otimizadas (WebP) automaticamente antes de ir para o armazenamento. A primeira aparece primeiro.
        </p>
        <GalleryUpload value={images} onChange={setImages} folder="site" />
      </section>

      <button onClick={save} disabled={saving} className="btn-orange disabled:opacity-50 inline-flex items-center gap-2">
        <Save className="w-4 h-4" /> {saving ? "Salvando…" : "Salvar bloco"}
      </button>
    </div>
  );
}
