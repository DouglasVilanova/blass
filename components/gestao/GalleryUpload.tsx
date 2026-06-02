"use client";

import { useRef, useState } from "react";
import { Plus, X, Loader2, ArrowLeft, ArrowRight, ImageIcon } from "lucide-react";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: "products" | "blog" | "site";
};

export default function GalleryUpload({ value, onChange, folder = "products" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setError(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erro no upload");
      onChange([...value, json.url]);
    } catch (e: any) {
      setError(e.message ?? "Falhou");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    // upload sequentially
    files.reduce((p, file) => p.then(() => uploadFile(file)), Promise.resolve());
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.reduce((p, file) => p.then(() => uploadFile(file)), Promise.resolve());
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...value];
    const to = idx + dir;
    if (to < 0 || to >= next.length) return;
    [next[idx], next[to]] = [next[to], next[idx]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="text-xs tracking-widest text-brown/70 font-semibold uppercase">
        Fotos adicionais <span className="text-brown/40 normal-case font-normal tracking-normal">({value.length} foto{value.length !== 1 ? "s" : ""})</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {value.map((url, idx) => (
          <div key={url + idx} className="relative group w-28 h-28 flex-shrink-0">
            <img src={url} alt={`foto ${idx + 1}`} className="w-full h-full object-cover border border-brown/10" />

            {/* Overlay controls */}
            <div className="absolute inset-0 bg-brown/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
              <button type="button" onClick={() => remove(idx)} className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700" title="Remover">
                <X className="w-3 h-3" />
              </button>
              <div className="flex gap-1">
                <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0} className="bg-white/80 text-brown rounded p-0.5 disabled:opacity-30 hover:bg-white" title="Mover para esquerda">
                  <ArrowLeft className="w-3 h-3" />
                </button>
                <button type="button" onClick={() => move(idx, 1)} disabled={idx === value.length - 1} className="bg-white/80 text-brown rounded p-0.5 disabled:opacity-30 hover:bg-white" title="Mover para direita">
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Position badge */}
            <div className="absolute bottom-1 left-1 bg-brown/70 text-cream-light text-[9px] px-1 rounded">
              {idx + 1}
            </div>
          </div>
        ))}

        {/* Add button */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !loading && inputRef.current?.click()}
          className="w-28 h-28 border-2 border-dashed border-brown/30 flex flex-col items-center justify-center gap-1 text-brown/40 cursor-pointer hover:border-orange hover:text-orange transition-colors flex-shrink-0"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-5 h-5" />
              <Plus className="w-4 h-4" />
              <span className="text-[10px]">Adicionar</span>
            </>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />

      {error && <p className="text-red-600 text-xs">{error}</p>}
      <p className="text-[11px] text-brown/40">Arraste ou clique para adicionar. Múltiplas fotos permitidas. Use as setas para reordenar.</p>
    </div>
  );
}
