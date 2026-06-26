"use client";

import { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import ConstruimosCard from "@/components/sections/ConstruimosCard";
import { useToast } from "@/components/gestao/Toast";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";
import { DEFAULT_STORE } from "@/lib/defaults";
import type { SiteLayouts } from "@/lib/types";

type Construimos = SiteLayouts["construimos"];

export default function ConstruimosEditor({ initialLayouts }: { initialLayouts: SiteLayouts }) {
  const { push } = useToast();
  const [c, setC] = useState<Construimos>(initialLayouts.construimos);
  const [saving, setSaving] = useState(false);

  function setLayer(layer: "mao" | "brilho", key: "x" | "y" | "w", value: number) {
    setC((prev) => ({ ...prev, [layer]: { ...prev[layer], [key]: value } }));
  }

  function reset() {
    setC(DEFAULT_STORE.settings.layouts.construimos);
  }

  async function save() {
    setSaving(true);
    const res = await saveSection("layouts", { ...initialLayouts, construimos: c });
    setSaving(false);
    if ("error" in res) push(res.error, "error");
    else push("Posições salvas! Recarregue o site para ver.");
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Preview */}
      <div className="bg-[#3d2616] rounded-lg p-10 overflow-hidden">
        <div className="max-w-[560px] mx-auto">
          <ConstruimosCard layout={c} animate={false} />
        </div>
      </div>

      {/* Controles */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Prédio */}
        <Group title="Prédio (BLASS)">
          <Slider label="Zoom" value={c.predioZoom} min={1} max={1.8} step={0.01}
            onChange={(v) => setC((p) => ({ ...p, predioZoom: v }))} fmt={(v) => v.toFixed(2) + "×"} />
        </Group>

        {/* Mão */}
        <Group title="Mão">
          <Slider label="Horizontal" value={c.mao.x} min={-20} max={120} step={1}
            onChange={(v) => setLayer("mao", "x", v)} fmt={(v) => v + "%"} />
          <Slider label="Vertical" value={c.mao.y} min={-20} max={120} step={1}
            onChange={(v) => setLayer("mao", "y", v)} fmt={(v) => v + "%"} />
          <Slider label="Tamanho" value={c.mao.w} min={10} max={110} step={1}
            onChange={(v) => setLayer("mao", "w", v)} fmt={(v) => v + "%"} />
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
