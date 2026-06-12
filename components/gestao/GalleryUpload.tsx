"use client";

import { useRef, useState } from "react";
import { Plus, X, Loader2, ArrowLeft, ArrowRight, ImageIcon, Star } from "lucide-react";
import { compressImage } from "@/lib/client-image";

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
    // Comprime no browser para não estourar o limite de 4.5 MB da Vercel (HTTP 413)
    const compressed = await compressImage(file);
    const fd = new FormData();
    fd.append("file", compressed);
    fd.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      // Resposta de erro pode não ser JSON (ex: 413 da borda devolve texto)
      const msg = await res.text().catch(() => "");
      if (res.status === 413) throw new Error("Imagem muito grande. Tente uma foto menor.");
      throw new Error(msg && msg.length < 200 ? msg : `Erro no upload (${res.status})`);
    }
    const json = await res.json();
    return json.url as string;
  }

  async function handleFiles(files: File[]) {
    if (files.length === 0) return;
    setError(null);
    setLoading(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const url = await uploadFile(file);
        uploaded.push(url);
      }
      onChange([...value, ...uploaded]);
    } catch (e: any) {
      setError(e.message ?? "Falhou");
    } finally {
      setLoading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(Array.from(e.dataTransfer.files));
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

  function setCover(idx: number) {
    if (idx === 0) return;
    const next = [...value];
    const [picked] = next.splice(idx, 1);
    next.unshift(picked);
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {/* Info bar */}
      <div className="flex items-center gap-2 text-xs text-brown/60 bg-cream-dark/50 border border-brown/10 px-3 py-2">
        <Star className="w-3.5 h-3.5 text-orange fill-orange flex-shrink-0" />
        <span>
          <strong className="text-brown">A primeira foto é a capa</strong> — exibida na listagem e como
          imagem principal. Use as setas para reordenar ou clique na estrela para definir a capa.
        </span>
      </div>

      {/* Grid */}
      <div className="flex flex-wrap gap-3">
        {value.map((url, idx) => {
          const isCover = idx === 0;
          return (
            <div key={url + idx} className={`relative group flex-shrink-0 ${isCover ? "ring-2 ring-orange ring-offset-2 ring-offset-white" : ""}`}>
              <div className="w-32 h-32 overflow-hidden border border-brown/10 bg-cream-dark">
                <img src={url} alt={`foto ${idx + 1}`} className="w-full h-full object-cover" />
              </div>

              {/* Cover badge — always visible on position 1 */}
              {isCover && (
                <div className="absolute -top-2 -left-2 bg-orange text-white text-[10px] tracking-widest px-2 py-0.5 font-semibold flex items-center gap-1 shadow">
                  <Star className="w-2.5 h-2.5 fill-white" /> CAPA
                </div>
              )}

              {/* Position number */}
              <div className="absolute bottom-1 right-1 bg-brown/80 text-cream-light text-[10px] px-1.5 py-0.5 rounded font-semibold">
                {idx + 1}
              </div>

              {/* Hover controls */}
              <div className="absolute inset-0 bg-brown/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                {/* Top row: remove */}
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  title="Remover"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Middle row: reorder */}
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    className="bg-white/90 text-brown rounded p-1 disabled:opacity-30 hover:bg-white"
                    title="Mover para esquerda"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, 1)}
                    disabled={idx === value.length - 1}
                    className="bg-white/90 text-brown rounded p-1 disabled:opacity-30 hover:bg-white"
                    title="Mover para direita"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Bottom row: set as cover */}
                {!isCover && (
                  <button
                    type="button"
                    onClick={() => setCover(idx)}
                    className="bg-orange text-white text-[10px] px-2 py-1 hover:bg-orange-dark flex items-center gap-1 font-semibold tracking-wide"
                    title="Definir como capa"
                  >
                    <Star className="w-2.5 h-2.5" /> CAPA
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add tile */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !loading && inputRef.current?.click()}
          className="w-32 h-32 border-2 border-dashed border-brown/30 flex flex-col items-center justify-center gap-1 text-brown/40 cursor-pointer hover:border-orange hover:text-orange transition-colors flex-shrink-0"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-5 h-5" />
              <Plus className="w-4 h-4" />
              <span className="text-[10px] text-center px-1">
                {value.length === 0 ? "Clique ou arraste" : "Adicionar mais"}
              </span>
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
        onChange={onInputChange}
      />

      {error && <p className="text-red-600 text-xs">{error}</p>}
      <p className="text-[11px] text-brown/40">
        Selecione múltiplas fotos de uma vez (Ctrl/Cmd + clique). Formatos: JPG, PNG, WebP. Otimização automática para WebP.
      </p>
    </div>
  );
}
