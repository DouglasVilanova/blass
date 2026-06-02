"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

type Props = {
  value?: string;          // current URL
  onChange: (url: string) => void;
  folder?: "products" | "blog" | "site";
  label?: string;
  hint?: string;
};

export default function ImageUpload({
  value,
  onChange,
  folder = "products",
  label = "Imagem",
  hint,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setLoading(true);

    // Local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "Erro no upload");

      onChange(json.url);
      setPreview(null); // use real URL now
    } catch (e: any) {
      setError(e.message ?? "Falhou");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function clear() {
    onChange("");
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const displaySrc = preview ?? value;

  return (
    <div>
      <div className="text-xs tracking-widest text-brown/70 font-semibold uppercase mb-1">
        {label}
      </div>

      {displaySrc ? (
        <div className="relative inline-block">
          <img
            src={displaySrc}
            alt="preview"
            className="w-48 h-48 object-cover border border-brown/20"
          />
          {loading && (
            <div className="absolute inset-0 bg-brown/50 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
          {!loading && (
            <button
              type="button"
              onClick={clear}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700"
              aria-label="Remover imagem"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="w-48 h-48 border-2 border-dashed border-brown/30 flex flex-col items-center justify-center gap-2 text-brown/50 cursor-pointer hover:border-orange hover:text-orange transition-colors"
        >
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-8 h-8" />
              <Upload className="w-4 h-4" />
              <span className="text-xs text-center px-2">
                Clique ou arraste<br />JPG, PNG, WebP, SVG
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      {hint && <p className="text-brown/50 text-[11px] mt-1">{hint}</p>}
    </div>
  );
}
