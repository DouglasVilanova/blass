"use client";

import { useMemo, useState } from "react";
import { Download, Search, Trash2 } from "lucide-react";
import { useToast } from "@/components/gestao/Toast";
import { useConfirm } from "@/components/gestao/ConfirmDialog";
import { deleteNewsletterSubscriber } from "@/app/gestao/(panel)/actions";
import type { NewsletterSubscriber } from "@/lib/db";

export default function NewsletterManager({ initial }: { initial: NewsletterSubscriber[] }) {
  const { push } = useToast();
  const confirm = useConfirm();
  const [list, setList] = useState(initial);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? list.filter((s) => s.email.toLowerCase().includes(t)) : list;
  }, [list, q]);

  function exportCsv() {
    const rows = ["nome;email;data_cadastro", ...list.map((s) => `${s.name ?? ""};${s.email};${new Date(s.createdAt).toLocaleString("pt-BR")}`)];
    const blob = new Blob(["﻿" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-blass-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function remove(email: string) {
    const ok = await confirm({
      title: "Excluir e-mail?",
      description: `Remover "${email}" da lista de novidades?`,
      confirmLabel: "Excluir",
      tone: "danger",
    });
    if (!ok) return;
    const res = await deleteNewsletterSubscriber(email);
    if ("error" in res) { push(res.error, "error"); return; }
    setList((prev) => prev.filter((s) => s.email !== email));
    push("E-mail removido.");
  }

  return (
    <div className="max-w-2xl space-y-4">
      {/* Barra: busca + exportar */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/40" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar e-mail…"
            className="w-full pl-9 pr-3 py-2 border border-brown/20 rounded bg-white text-sm focus:outline-none focus:border-orange"
          />
        </div>
        <button
          onClick={exportCsv}
          disabled={list.length === 0}
          className="btn-outline text-xs px-4 inline-flex items-center gap-1.5 disabled:opacity-40"
        >
          <Download className="w-3.5 h-3.5" /> Exportar CSV
        </button>
      </div>

      {/* Lista */}
      <section className="bg-white border border-brown/10 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-brown/10 text-xs tracking-widest text-brown/50 font-semibold uppercase">
          {list.length} e-mail{list.length !== 1 ? "s" : ""} cadastrado{list.length !== 1 ? "s" : ""}
        </div>
        <ul className="divide-y divide-brown/10 max-h-[60vh] overflow-y-auto">
          {filtered.map((s) => (
            <li key={s.email} className="flex items-center gap-3 px-5 py-2.5">
              <div className="flex-1 min-w-0">
                <div className="text-sm text-brown truncate">
                  {s.name ? <span className="font-medium">{s.name} · </span> : null}{s.email}
                </div>
                <div className="text-[11px] text-brown/40">{new Date(s.createdAt).toLocaleString("pt-BR")}</div>
              </div>
              <button
                onClick={() => remove(s.email)}
                className="text-brown/40 hover:text-red-600 p-1.5"
                aria-label={`Excluir ${s.email}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-5 py-10 text-center text-sm text-brown/40">
              {list.length === 0 ? "Nenhum e-mail cadastrado ainda." : "Nenhum resultado para a busca."}
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
