"use client";

import { useState } from "react";
import { Plus, X, Pencil, Trash2, Check } from "lucide-react";
import { useConfirm } from "./ConfirmDialog";
import type { ProductAttribute } from "@/lib/types";

type Props = {
  value: ProductAttribute[];
  onChange: (attrs: ProductAttribute[]) => void;
};

/**
 * Editor de características estruturadas.
 * Cada grupo tem um nome (Material, Cor…) e 1+ valores (Alumínio, Aço…).
 * Nome editável inline, grupo excluível, valores adicionáveis/removíveis.
 */
export default function AttributesEditor({ value, onChange }: Props) {
  const confirm = useConfirm();

  // Novo grupo
  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState("");

  // Edição de nome inline (índice do grupo em edição)
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  // Input de valor por grupo (índice → texto)
  const [valueInputs, setValueInputs] = useState<Record<number, string>>({});

  function addGroup() {
    const name = newName.trim();
    if (!name) return;
    if (value.some((a) => a.name.toLowerCase() === name.toLowerCase())) {
      setNewName("");
      setNewOpen(false);
      return;
    }
    onChange([...value, { name, values: [] }]);
    setNewName("");
    setNewOpen(false);
  }

  function renameGroup(idx: number) {
    const name = editName.trim();
    if (!name) { setEditingIdx(null); return; }
    onChange(value.map((a, i) => (i === idx ? { ...a, name } : a)));
    setEditingIdx(null);
  }

  async function removeGroup(idx: number) {
    const attr = value[idx];
    const ok = await confirm({
      title: "Excluir característica",
      description: `Excluir "${attr.name}"${attr.values.length > 0 ? ` e seus ${attr.values.length} valor(es)` : ""}?`,
      confirmLabel: "Excluir",
      tone: "danger",
    });
    if (!ok) return;
    onChange(value.filter((_, i) => i !== idx));
  }

  function addValue(idx: number) {
    const text = (valueInputs[idx] ?? "").trim();
    if (!text) return;
    const attr = value[idx];
    if (!attr.values.some((v) => v.toLowerCase() === text.toLowerCase())) {
      onChange(value.map((a, i) => (i === idx ? { ...a, values: [...a.values, text] } : a)));
    }
    setValueInputs({ ...valueInputs, [idx]: "" });
  }

  function removeValue(idx: number, v: string) {
    onChange(value.map((a, i) => (i === idx ? { ...a, values: a.values.filter((x) => x !== v) } : a)));
  }

  return (
    <div className="space-y-4">
      {/* Grupos existentes */}
      {value.map((attr, idx) => (
        <div key={idx} className="border border-brown/15 bg-cream-light/50">
          {/* Cabeçalho do grupo: nome + ações */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-brown/10 bg-white">
            {editingIdx === idx ? (
              <div className="flex gap-1 flex-1 max-w-xs">
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); renameGroup(idx); }
                    if (e.key === "Escape") setEditingIdx(null);
                  }}
                  className="border border-brown/20 px-2 py-1 text-sm flex-1 focus:outline-none focus:border-orange"
                />
                <button
                  type="button"
                  onClick={() => renameGroup(idx)}
                  className="bg-orange text-white px-2 flex items-center"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingIdx(null)}
                  className="border border-brown/20 px-2 text-brown/50 hover:bg-cream-dark flex items-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <span className="text-sm font-semibold text-brown uppercase tracking-wide">{attr.name}</span>
                <button
                  type="button"
                  onClick={() => { setEditingIdx(idx); setEditName(attr.name); }}
                  aria-label={`Editar nome de ${attr.name}`}
                  className="text-brown/40 hover:text-orange p-1"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => removeGroup(idx)}
              aria-label={`Excluir ${attr.name}`}
              className="ml-auto text-brown/40 hover:text-red-600 p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Valores do grupo */}
          <div className="px-4 py-3 space-y-3">
            {attr.values.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attr.values.map((v) => (
                  <span key={v} className="flex items-center gap-1.5 text-xs bg-white border border-brown/20 px-2.5 py-1">
                    {v}
                    <button
                      type="button"
                      onClick={() => removeValue(idx, v)}
                      aria-label={`Remover ${v}`}
                      className="text-brown/40 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2 max-w-sm">
              <input
                value={valueInputs[idx] ?? ""}
                onChange={(e) => setValueInputs({ ...valueInputs, [idx]: e.target.value })}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === ",") && (valueInputs[idx] ?? "").trim()) {
                    e.preventDefault();
                    addValue(idx);
                  }
                }}
                placeholder={`Valor de ${attr.name} — Enter para adicionar`}
                className="border border-brown/20 px-3 py-2 text-sm flex-1 focus:outline-none focus:border-orange bg-white"
              />
              <button type="button" onClick={() => addValue(idx)} className="btn-outline text-xs px-4">
                Adicionar
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Adicionar novo grupo */}
      {newOpen ? (
        <div className="flex gap-1 max-w-sm">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); addGroup(); }
              if (e.key === "Escape") { setNewOpen(false); setNewName(""); }
            }}
            placeholder='Nome da característica — ex: "Material", "Cor"'
            className="border border-brown/20 px-3 py-2 text-sm flex-1 focus:outline-none focus:border-orange"
          />
          <button
            type="button"
            onClick={addGroup}
            disabled={!newName.trim()}
            className="bg-orange text-white px-3 text-xs font-semibold disabled:opacity-50"
          >
            OK
          </button>
          <button
            type="button"
            onClick={() => { setNewOpen(false); setNewName(""); }}
            className="border border-brown/20 px-2 text-brown/50 hover:bg-cream-dark"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setNewOpen(true)}
          className="text-sm text-orange hover:underline flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Adicionar característica
        </button>
      )}
    </div>
  );
}
