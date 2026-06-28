"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2, MapPin } from "lucide-react";
import { Field, inputCls } from "./Field";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmDialog";
import { saveRepresentante, deleteRepresentante, type RepInput } from "@/app/gestao/(panel)/actions";
import type { Representante } from "@/lib/types";

const EMPTY: RepInput = { nome: "", empresa: "", cidade: "", estado: "", phone: "", email: "", published: true };

export default function RepresentantesManager({ initial }: { initial: Representante[] }) {
  const { push } = useToast();
  const confirm = useConfirm();
  const [list, setList] = useState<Representante[]>(initial);
  const [form, setForm] = useState<RepInput | null>(null);
  const [saving, setSaving] = useState(false);

  function openNew() { setForm({ ...EMPTY }); }
  function openEdit(r: Representante) {
    setForm({ id: r.id, nome: r.nome, empresa: r.empresa ?? "", cidade: r.cidade ?? "", estado: r.estado ?? "", phone: r.phone ?? "", email: r.email ?? "", published: r.published ?? true, createdAt: r.createdAt });
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    const res = await saveRepresentante(form);
    setSaving(false);
    if ("error" in res) { push(res.error, "error"); return; }
    setList((prev) => {
      const without = prev.filter((r) => r.id !== res.rep.id);
      return [...without, res.rep].sort((a, b) =>
        (a.estado ?? "").localeCompare(b.estado ?? "") || (a.cidade ?? "").localeCompare(b.cidade ?? "") || a.nome.localeCompare(b.nome)
      );
    });
    setForm(null);
    push("Representante salvo!");
  }

  async function remove(r: Representante) {
    const ok = await confirm({ title: "Excluir representante", description: `Excluir "${r.nome}"?`, confirmLabel: "Excluir", tone: "danger" });
    if (!ok) return;
    const res = await deleteRepresentante(r.id);
    if ("error" in res) { push(res.error, "error"); return; }
    setList((prev) => prev.filter((x) => x.id !== r.id));
    push("Representante excluído.");
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Form */}
      {form ? (
        <section className="bg-white border border-brown/10 rounded-xl p-6 space-y-4">
          <h2 className="font-exo font-bold text-lg text-brown">{form.id ? "Editar representante" : "Novo representante"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nome do representante" hint="Pessoa de contato. Ex: João Silva">
              <input className={inputCls} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </Field>
            <Field label="Empresa" hint="Razão/nome fantasia. Ex: Silva Representações">
              <input className={inputCls} value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} />
            </Field>
            <Field label="Cidade" hint="Ex: Caxias do Sul">
              <input className={inputCls} value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
            </Field>
            <Field label="Estado (UF)" hint="Sigla com 2 letras. Ex: RS">
              <input className={inputCls} maxLength={2} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value.toUpperCase() })} />
            </Field>
            <Field label="WhatsApp / Telefone" hint="Com DDD. Ex: 54 99999-9999">
              <input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="E-mail (opcional)" hint="Ex: contato@empresa.com.br">
              <input className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-orange" />
            <span className="text-sm">Publicado <span className="text-brown/50">(aparece na página de representantes do site)</span></span>
          </label>
          <div className="flex items-center gap-3">
            <button onClick={save} disabled={saving} className="btn-orange disabled:opacity-50 inline-flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar
            </button>
            <button onClick={() => setForm(null)} className="text-sm text-brown/60 hover:text-brown inline-flex items-center gap-1">
              <X className="w-4 h-4" /> Cancelar
            </button>
          </div>
        </section>
      ) : (
        <button onClick={openNew} className="btn-orange inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo representante
        </button>
      )}

      {/* Lista */}
      <section className="bg-white border border-brown/10 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-brown/10 text-xs tracking-widest text-brown/50 font-semibold uppercase">
          {list.length} representante{list.length !== 1 ? "s" : ""}
        </div>
        <ul className="divide-y divide-brown/10">
          {list.map((r) => (
            <li key={r.id} className="flex items-center gap-3 px-5 py-3">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-brown truncate">
                  {r.nome}
                  {r.empresa && <span className="text-brown/50 font-normal"> — {r.empresa}</span>}
                  {!r.published && <span className="ml-2 text-[10px] uppercase tracking-wide bg-brown/10 text-brown/50 px-1.5 py-0.5 rounded">oculto</span>}
                </div>
                <div className="text-xs text-brown/50 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {[r.cidade, r.estado].filter(Boolean).join(" / ") || "—"}
                  {r.phone && <span className="ml-2">· {r.phone}</span>}
                </div>
              </div>
              <button onClick={() => openEdit(r)} className="text-brown/40 hover:text-orange p-1.5" aria-label="Editar"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(r)} className="text-brown/40 hover:text-red-600 p-1.5" aria-label="Excluir"><Trash2 className="w-4 h-4" /></button>
            </li>
          ))}
          {list.length === 0 && <li className="px-5 py-8 text-center text-sm text-brown/40">Nenhum representante cadastrado ainda.</li>}
        </ul>
      </section>
    </div>
  );
}
