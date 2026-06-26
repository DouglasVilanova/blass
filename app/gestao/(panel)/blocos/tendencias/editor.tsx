"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import ImageUpload from "@/components/gestao/ImageUpload";
import { Field, inputCls } from "@/components/gestao/Field";
import { useToast } from "@/components/gestao/Toast";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";
import type { SiteSettings } from "@/lib/types";

export default function TendenciasEditor({ initial }: { initial: SiteSettings["tendencias"] }) {
  const { push } = useToast();
  const [text, setText] = useState(initial.text);
  const [highlight, setHighlight] = useState(initial.highlight);
  const [image, setImage] = useState(initial.image);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await saveSection("tendencias", { text, highlight, image });
    setSaving(false);
    if ("error" in res) push(res.error, "error");
    else push("Bloco salvo! Recarregue o site para ver.");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <section className="bg-white border border-brown/10 rounded-xl p-6 space-y-5">
        <Field label="Texto" hint="Use **palavra** para negrito. Ex: A **Blass** não nasceu…">
          <input value={text} onChange={(e) => setText(e.target.value)} className={inputCls} />
        </Field>

        <Field label="Destaque (laranja)" hint="Parte final em laranja. Ex: Nasceu para criá-las!">
          <input value={highlight} onChange={(e) => setHighlight(e.target.value)} className={inputCls} />
        </Field>

        <div>
          <label className="block text-xs tracking-widest text-brown/70 font-semibold uppercase mb-2">
            Imagem de fundo
          </label>
          <ImageUpload value={image} onChange={setImage} folder="site" aspect="ultrawide" recommended="2300 × 350 px" />
        </div>

        {/* Prévia */}
        <div className="relative overflow-hidden rounded-lg border border-brown/10">
          {image && <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative py-8 px-4 text-center">
            <span className="font-exo text-cream-light text-lg md:text-xl font-medium">
              {text.replace(/\*\*/g, "")} <span className="text-orange font-bold">{highlight}</span>
            </span>
          </div>
        </div>
      </section>

      <button onClick={save} disabled={saving} className="btn-orange disabled:opacity-50 inline-flex items-center gap-2">
        <Save className="w-4 h-4" /> {saving ? "Salvando…" : "Salvar bloco"}
      </button>
    </div>
  );
}
