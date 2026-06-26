"use client";

import { useState } from "react";
import { Save, X, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/components/gestao/Toast";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";

export default function PillsEditor({ initialWords }: { initialWords: string[] }) {
  const { push } = useToast();
  const [words, setWords] = useState<string[]>(initialWords);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  function add() {
    const w = input.trim().toUpperCase();
    if (!w) return;
    if (!words.includes(w)) setWords([...words, w]);
    setInput("");
  }

  function remove(i: number) {
    setWords(words.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const to = i + dir;
    if (to < 0 || to >= words.length) return;
    const next = [...words];
    [next[i], next[to]] = [next[to], next[i]];
    setWords(next);
  }

  async function save() {
    setSaving(true);
    const res = await saveSection("pills", { words });
    setSaving(false);
    if ("error" in res) push(res.error, "error");
    else push("Faixa salva! Recarregue o site para ver.");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <section className="bg-white border border-brown/10 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="font-exo font-bold text-lg text-brown">Palavras da faixa</h2>
          <p className="text-xs text-brown/50 mt-1">
            Cada palavra vira uma "pílula" na faixa laranja. Use as setas para reordenar.
          </p>
        </div>

        {/* Adicionar */}
        <div className="flex gap-2 max-w-sm">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); add(); }
            }}
            placeholder="Nova palavra e Enter"
            className="border border-brown/20 rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:border-orange uppercase"
          />
          <button type="button" onClick={add} className="btn-outline text-xs px-4 inline-flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        </div>

        {/* Lista */}
        <ul className="divide-y divide-brown/10 border border-brown/10 rounded-lg">
          {words.map((w, i) => (
            <li key={w + i} className="flex items-center gap-2 px-3 py-2">
              <span className="flex-1 text-sm text-brown font-medium">{w}</span>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                className="text-brown/40 hover:text-orange disabled:opacity-25 p-1" aria-label="Subir">
                <ArrowUp className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === words.length - 1}
                className="text-brown/40 hover:text-orange disabled:opacity-25 p-1" aria-label="Descer">
                <ArrowDown className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => remove(i)}
                className="text-brown/40 hover:text-red-600 p-1" aria-label="Remover">
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
          {words.length === 0 && (
            <li className="px-3 py-4 text-sm text-brown/40 text-center">Nenhuma palavra.</li>
          )}
        </ul>
      </section>

      <button
        onClick={save}
        disabled={saving}
        className="btn-orange disabled:opacity-50 inline-flex items-center gap-2"
      >
        <Save className="w-4 h-4" /> {saving ? "Salvando…" : "Salvar faixa"}
      </button>
    </div>
  );
}
