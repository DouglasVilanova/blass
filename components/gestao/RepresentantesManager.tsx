"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2, MapPin } from "lucide-react";
import { Field, inputCls } from "./Field";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmDialog";
import { saveRepresentante, deleteRepresentante, type RepInput } from "@/app/gestao/(panel)/actions";
import type { Representante } from "@/lib/types";

const EMPTY: RepInput = { nome: "", empresa: "", cidade: "", estados: [], phones: [], emails: [], published: true };

export default function RepresentantesManager({ initial }: { initial: Representante[] }) {
  const { push } = useToast();
  const confirm = useConfirm();
  const [list, setList] = useState<Representante[]>(initial);
  const [form, setForm] = useState<RepInput | null>(null);
  const [saving, setSaving] = useState(false);

  const [ufInput, setUfInput] = useState("");

  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  function openNew() { setForm({ ...EMPTY }); setUfInput(""); setEmailInput(""); setPhoneInput(""); }
  function openEdit(r: Representante) {
    setForm({ id: r.id, nome: r.nome, empresa: r.empresa ?? "", cidade: r.cidade ?? "", estados: r.estados ?? [], phones: r.phones ?? [], emails: r.emails ?? [], published: r.published ?? true, createdAt: r.createdAt });
    setUfInput("");
    setEmailInput("");
    setPhoneInput("");
  }

  function addPhone() {
    if (!form) return;
    const ph = phoneInput.trim();
    if (!ph) return;
    const list = form.phones ?? [];
    if (!list.includes(ph)) setForm({ ...form, phones: [...list, ph] });
    setPhoneInput("");
  }
  function removePhone(ph: string) {
    if (!form) return;
    setForm({ ...form, phones: (form.phones ?? []).filter((p) => p !== ph) });
  }

  function addUf() {
    if (!form) return;
    const uf = ufInput.trim().toUpperCase().slice(0, 2);
    if (!uf) return;
    const list = form.estados ?? [];
    if (!list.includes(uf)) setForm({ ...form, estados: [...list, uf] });
    setUfInput("");
  }
  function removeUf(uf: string) {
    if (!form) return;
    setForm({ ...form, estados: (form.estados ?? []).filter((e) => e !== uf) });
  }

  function addEmail() {
    if (!form) return;
    const em = emailInput.trim();
    if (!em) return;
    const list = form.emails ?? [];
    if (!list.includes(em)) setForm({ ...form, emails: [...list, em] });
    setEmailInput("");
  }
  function removeEmail(em: string) {
    if (!form) return;
    setForm({ ...form, emails: (form.emails ?? []).filter((e) => e !== em) });
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
        (a.estados[0] ?? "").localeCompare(b.estados[0] ?? "") || (a.cidade ?? "").localeCompare(b.cidade ?? "") || a.nome.localeCompare(b.nome)
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
            <Field label="Cidade(s)" hint="Pode listar várias. Ex: Vila Velha, Serra, Vitória">
              <input className={inputCls} value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
            </Field>
            <Field label="Estados (UF)" hint="Adicione um ou mais. Digite a sigla e Enter. Ex: ES, RJ">
              <div>
                {(form.estados?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.estados!.map((uf) => (
                      <span key={uf} className="flex items-center gap-1 text-xs bg-cream-dark border border-brown/20 px-2 py-1 rounded">
                        {uf}
                        <button type="button" onClick={() => removeUf(uf)} className="text-brown/40 hover:text-red-600" aria-label={`Remover ${uf}`}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    className={inputCls + " uppercase"}
                    maxLength={2}
                    value={ufInput}
                    onChange={(e) => setUfInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addUf(); } }}
                    placeholder="UF"
                  />
                  <button type="button" onClick={addUf} className="btn-outline text-xs px-3 whitespace-nowrap">Adicionar</button>
                </div>
              </div>
            </Field>
            <Field label="WhatsApp / Telefones" hint="Adicione um ou mais. Com DDD. Digite e Enter. Ex: 54 99999-9999">
              <div>
                {(form.phones?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.phones!.map((ph) => (
                      <span key={ph} className="flex items-center gap-1 text-xs bg-cream-dark border border-brown/20 px-2 py-1 rounded">
                        {ph}
                        <button type="button" onClick={() => removePhone(ph)} className="text-brown/40 hover:text-red-600" aria-label={`Remover ${ph}`}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    className={inputCls}
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addPhone(); } }}
                    placeholder="54 99999-9999"
                  />
                  <button type="button" onClick={addPhone} className="btn-outline text-xs px-3 whitespace-nowrap">Adicionar</button>
                </div>
              </div>
            </Field>
            <Field label="E-mails" hint="Adicione um ou mais. Digite e Enter. Ex: comercial@empresa.com.br">
              <div>
                {(form.emails?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.emails!.map((em) => (
                      <span key={em} className="flex items-center gap-1 text-xs bg-cream-dark border border-brown/20 px-2 py-1 rounded">
                        {em}
                        <button type="button" onClick={() => removeEmail(em)} className="text-brown/40 hover:text-red-600" aria-label={`Remover ${em}`}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="email"
                    className={inputCls}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addEmail(); } }}
                    placeholder="email@empresa.com.br"
                  />
                  <button type="button" onClick={addEmail} className="btn-outline text-xs px-3 whitespace-nowrap">Adicionar</button>
                </div>
              </div>
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
                  {[r.cidade, r.estados.join(", ")].filter(Boolean).join(" — ") || "—"}
                  {r.phones.length > 0 && <span className="ml-2">· {r.phones.join(" / ")}</span>}
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
