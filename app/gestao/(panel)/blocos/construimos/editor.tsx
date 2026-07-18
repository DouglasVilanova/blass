"use client";

import { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import ConstruimosCard from "@/components/sections/ConstruimosCard";
import { Field, inputCls } from "@/components/gestao/Field";
import { useToast } from "@/components/gestao/Toast";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";
import { DEFAULT_STORE } from "@/lib/defaults";
import type { SiteLayouts, SiteSettings } from "@/lib/types";

type Construimos = SiteLayouts["construimos"];

function splitParas(s: string): string[] {
  return s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

export default function ConstruimosEditor({
  initialLayouts,
  initialTexto,
}: {
  initialLayouts: SiteLayouts;
  initialTexto: SiteSettings["construimos"];
}) {
  const { push } = useToast();
  const [c, setC] = useState<Construimos>(initialLayouts.construimos);
  const [title, setTitle] = useState(initialTexto.title);
  const [paras, setParas] = useState(initialTexto.paragraphs.join("\n\n"));
  const [saving, setSaving] = useState(false);

  function setLayer(layer: "brilho", key: "x" | "y" | "w", value: number) {
    setC((prev) => ({ ...prev, [layer]: { ...prev[layer], [key]: value } }));
  }

  function reset() {
    setC(DEFAULT_STORE.settings.layouts.construimos);
  }

  async function save() {
    setSaving(true);
    const r1 = await saveSection("layouts", { ...initialLayouts, construimos: c });
    const r2 = await saveSection("construimos", { title, paragraphs: splitParas(paras) });
    setSaving(false);
    if ("error" in r1) return push(r1.error, "error");
    if ("error" in r2) return push(r2.error, "error");
    push("Bloco salvo! Recarregue o site para ver.");
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Texto */}
      <div className="bg-white border border-brown/10 rounded-xl p-6 space-y-4">
        <h2 className="font-exo font-bold text-lg text-brown">Texto</h2>
        <Field label="Título" hint='Use **palavra** para destacar em laranja. Ex: A **BLASS** QUE CONSTRUÍMOS'>
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Parágrafos" hint="Separe cada parágrafo com uma linha em branco. Use **texto** para negrito.">
          <textarea className={inputCls + " min-h-[180px]"} value={paras} onChange={(e) => setParas(e.target.value)} />
        </Field>
      </div>

      {/* Preview */}
      <div className="bg-[#3d2616] rounded-lg p-10 overflow-hidden">
        <div className="max-w-[560px] mx-auto">
          <ConstruimosCard layout={c} animate={false} />
        </div>
      </div>

      {/* Controles */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Prédio */}
        <Group title="Prédio (BLASS)">
          <Slider label="Zoom" value={c.predioZoom} min={1} max={1.8} step={0.01}
            onChange={(v) => setC((p) => ({ ...p, predioZoom: v }))} fmt={(v) => v.toFixed(2) + "×"} />
        </Group>

        {/* Brilho */}
        <Group title="Brilho">
          <Slider label="Horizontal" value={c.brilho.x} min={-20} max={120} step={1}
            onChange={(v) => setLayer("brilho", "x", v)} fmt={(v) => v + "%"} />
          <Slider label="Vertical" value={c.brilho.y} min={-20} max={120} step={1}
            onChange={(v) => setLayer("brilho", "y", v)} fmt={(v) => v + "%"} />
          <Slider label="Tamanho" value={c.brilho.w} min={10} max={120} step={1}
            onChange={(v) => setLayer("brilho", "w", v)} fmt={(v) => v + "%"} />
        </Group>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving}
          className="btn-orange disabled:opacity-50 inline-flex items-center gap-2">
          <Save className="w-4 h-4" /> {saving ? "Salvando…" : "Salvar posições"}
        </button>
        <button onClick={reset}
          className="inline-flex items-center gap-2 text-sm text-brown/60 hover:text-brown">
          <RotateCcw className="w-4 h-4" /> Restaurar padrão
        </button>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-brown/10 p-4 space-y-3">
      <div className="text-xs tracking-widest text-brown/70 font-semibold uppercase">{title}</div>
      {children}
    </div>
  );
}

function Slider({
  label, value, min, max, step, onChange, fmt,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; fmt: (v: number) => string;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between text-xs text-brown/70 mb-1">
        <span>{label}</span>
        <span className="font-mono text-brown">{fmt(value)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-orange"
      />
    </label>
  );
}
