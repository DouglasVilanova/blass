"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import GalleryUpload from "@/components/gestao/GalleryUpload";
import { useToast } from "@/components/gestao/Toast";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";

export default function InovacaoEditor({ initialImages }: { initialImages: string[] }) {
  const { push } = useToast();
  const [images, setImages] = useState<string[]>(initialImages);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await saveSection("inovacao", { images });
    setSaving(false);
    if ("error" in res) push(res.error, "error");
    else push("Galeria salva! Recarregue o site para ver.");
  }

  return (
    <div className="max-w-3xl space-y-6">
      <section className="bg-white border border-brown/10 p-6">
        <h2 className="font-display text-lg text-brown mb-1">Imagens da galeria</h2>
        <p className="text-xs text-brown/50 mb-4">
          Adicione, remova ou reordene. As imagens são otimizadas (WebP) automaticamente antes de ir
          para o armazenamento. A primeira imagem é a que aparece primeiro no site.
        </p>
        <GalleryUpload value={images} onChange={setImages} folder="site" />
      </section>

      <button
        onClick={save}
        disabled={saving}
        className="btn-orange disabled:opacity-50 inline-flex items-center gap-2"
      >
        <Save className="w-4 h-4" /> {saving ? "Salvando…" : "Salvar galeria"}
      </button>
    </div>
  );
}
