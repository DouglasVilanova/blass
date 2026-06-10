"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon, RotateCw } from "lucide-react";

type Aspect = "square" | "wide" | "portrait" | "ultrawide";

type Props = {
  value?: string;
  onChange: (url: string) => void;
  folder?: "products" | "blog" | "site";
  label?: string;
  /** Tamanho recomendado, ex: "1920 × 1080 px" */
  recommended?: string;
  /** Proporção do preview */
  aspect?: Aspect;
  /** Texto auxiliar abaixo do upload */
  hint?: string;
};

const ASPECT_CLASSES: Record<Aspect, string> = {
  square: "aspect-square w-48",
  wide: "aspect-video w-64",
  portrait: "aspect-[4/5] w-44",
  ultrawide: "aspect-[21/9] w-72",
};

export default function ImageUpload({
  value,
  onChange,
  folder = "site",
  label = "Imagem",
  recommended,
  aspect = "square",
  hint,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset broken state whenever the value changes (new upload, manual change, etc.)
  useEffect(() => {
    setBroken(false);
  }, [value]);

  async function handleFile(file: File) {
    setError(null);
    setLoading(true);

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
      setPreview(null);
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
    e.target.value = "";
  }

  function clear() {
    onChange("");
    setPreview(null);
    setError(null);
    setBroken(false);
  }

  const displaySrc = preview ?? value;
  const hasValidImage = !!displaySrc && !broken;
  const aspectCls = ASPECT_CLASSES[aspect];

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="text-xs tracking-widest text-brown/70 font-semibold uppercase">{label}</div>
        {recommended && (
          <div className="text-[11px] text-brown/50">
            <span className="text-brown/40">recomendado:</span> {recommended}
          </div>
        )}
      </div>

      {hasValidImage ? (
        <div className="flex flex-wrap items-start gap-3">
          {/* Preview */}
          <div className={`relative ${aspectCls} overflow-hidden border border-brown/15 bg-cream-dark group`}>
            <img
              src={displaySrc!}
              alt="preview"
              className="w-full h-full object-cover"
              onError={() => setBroken(true)}
              onLoad={() => setBroken(false)}
            />

            {loading && (
              <div className="absolute inset-0 bg-brown/60 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}

            {!loading && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-brown/40 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="bg-white text-brown px-3 py-1.5 text-xs font-semibold tracking-wide hover:bg-orange hover:text-white transition-colors flex items-center gap-1.5"
                  title="Trocar imagem"
                >
                  <RotateCw className="w-3 h-3" /> TROCAR
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="bg-red-600 text-white px-3 py-1.5 text-xs font-semibold tracking-wide hover:bg-red-700 transition-colors flex items-center gap-1.5"
                  title="Remover imagem"
                >
                  <X className="w-3 h-3" /> REMOVER
                </button>
              </div>
            )}
          </div>

          {/* Side actions */}
          <div className="flex flex-col gap-2 text-xs">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="border border-orange text-orange px-3 py-2 hover:bg-orange hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold tracking-wide"
            >
              <Upload className="w-3.5 h-3.5" /> TROCAR IMAGEM
            </button>
            <p className="text-[11px] text-brown/50 max-w-[180px]">
              Otimização automática para WebP. Imagem antiga substituída.
            </p>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className={`${aspectCls} border-2 border-dashed border-brown/30 flex flex-col items-center justify-center gap-2 text-brown/50 cursor-pointer hover:border-orange hover:text-orange transition-colors`}
        >
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-7 h-7" />
              <Upload className="w-4 h-4" />
              <span className="text-xs text-center px-2">
                {broken
                  ? "Imagem não encontrada"
                  : <>Clique ou arraste<br />JPG, PNG, WebP, SVG</>}
              </span>
              {broken && displaySrc && (
                <span className="text-[10px] text-red-600 px-2 text-center break-all max-w-[200px]">
                  {displaySrc}
                </span>
              )}
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

      {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
      {hint && <p className="text-brown/50 text-[11px] mt-2">{hint}</p>}
    </div>
  );
}
