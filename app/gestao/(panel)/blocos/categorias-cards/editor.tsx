"use client";

import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import ImageUpload from "@/components/gestao/ImageUpload";
import { Field, inputCls } from "@/components/gestao/Field";
import { useToast } from "@/components/gestao/Toast";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";
import type { SiteSettings } from "@/lib/types";

type Card = SiteSettings["categoriasCards"]["cards"][number];

export default function CategoriasCardsEditor({ initialCards }: { initialCards: Card[] }) {
  const { push } = useToast();
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [saving, setSaving] = useState(false);

  function update(i: number, patch: Partial<Card>) {
    setCards(cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }
  function addCard() {
    setCards([...cards, { label: "NOVA CATEGORIA", href: "/produtos", off: "", on: "" }]);
  }
  function removeCard(i: number) {
    setCards(cards.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true);
    const clean = cards
      .map((c) => ({ ...c, label: c.label.trim(), href: c.href.trim() }))
      .filter((c) => c.label);
    const res = await saveSection("categoriasCards", { cards: clean });
    setSaving(false);
    if ("error" in res) push(res.error, "error");
    else push("Cards salvos! Recarregue o site para ver.");
  }

  return (
    <div className="max-w-3xl space-y-6">
      {cards.map((c, i) => (
        <section key={i} className="bg-white border border-brown/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest text-brown/50 font-semibold uppercase">
              Card {i + 1} {i % 2 === 1 ? "(direita)" : "(esquerda)"}
            </span>
            <button type="button" onClick={() => removeCard(i)} className="text-brown/40 hover:text-red-600 p-1" aria-label="Remover card">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nome">
              <input value={c.label} onChange={(e) => update(i, { label: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Link" hint="Ex: /produtos?cat=iluminacao">
              <input value={c.href} onChange={(e) => update(i, { href: e.target.value })} className={inputCls} />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-widest text-brown/70 font-semibold uppercase mb-2">Imagem apagada (padrão)</label>
              <ImageUpload value={c.off} onChange={(url) => update(i, { off: url })} folder="site" aspect="wide" />
            </div>
            <div>
              <label className="block text-xs tracking-widest text-brown/70 font-semibold uppercase mb-2">Imagem acesa (hover)</label>
              <ImageUpload value={c.on} onChange={(url) => update(i, { on: url })} folder="site" aspect="wide" />
            </div>
          </div>
        </section>
      ))}

      <div className="flex items-center gap-4">
        <button onClick={save} disabled={saving} className="btn-orange disabled:opacity-50 inline-flex items-center gap-2">
          <Save className="w-4 h-4" /> {saving ? "Salvando…" : "Salvar cards"}
        </button>
        <button onClick={addCard} className="inline-flex items-center gap-2 text-sm text-orange hover:underline">
          <Plus className="w-4 h-4" /> Adicionar card
        </button>
      </div>
    </div>
  );
}
