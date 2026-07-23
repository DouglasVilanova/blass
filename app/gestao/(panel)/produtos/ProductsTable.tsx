"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, Search, X, Star } from "lucide-react";
import { deleteProduct, deleteProducts } from "@/app/gestao/(panel)/actions";
import { useToast } from "@/components/gestao/Toast";
import { useConfirm } from "@/components/gestao/ConfirmDialog";
import { productAttrs } from "@/lib/attributes";
import type { Category, Product } from "@/lib/types";

const PAGE_SIZE = 30;

type StatusFilter = "all" | "published" | "draft" | "featured";

export default function ProductsTable({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const { push } = useToast();
  const confirm = useConfirm();
  const [pending, start] = useTransition();

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);

  const catMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.slug, c])),
    [categories]
  );

  // Filter pipeline
  const filtered = useMemo(() => {
    let out = products;

    if (search) {
      const q = search.toLowerCase();
      out = out.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          productAttrs(p).some(
            (a) => a.name.toLowerCase().includes(q) || a.values.some((v) => v.toLowerCase().includes(q))
          )
      );
    }

    if (catFilter !== "all") out = out.filter((p) => p.category === catFilter);

    if (statusFilter === "published") out = out.filter((p) => p.published);
    else if (statusFilter === "draft") out = out.filter((p) => !p.published);
    else if (statusFilter === "featured") out = out.filter((p) => p.featured);

    return out;
  }, [products, search, catFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset page when filters change
  useMemo(() => setPage(0), [search, catFilter, statusFilter]);

  // Selection helpers
  const allOnPageSelected =
    pageItems.length > 0 && pageItems.every((p) => selected.has(p.id));
  const someSelected = selected.size > 0;

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function toggleAllOnPage() {
    const next = new Set(selected);
    if (allOnPageSelected) {
      pageItems.forEach((p) => next.delete(p.id));
    } else {
      pageItems.forEach((p) => next.add(p.id));
    }
    setSelected(next);
  }

  function clearFilters() {
    setSearch("");
    setCatFilter("all");
    setStatusFilter("all");
  }

  async function handleBulkDelete() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const ok = await confirm({
      title: `Excluir ${ids.length} produto${ids.length > 1 ? "s" : ""}?`,
      description: `Todas as imagens vinculadas serão removidas do storage.\n\nEsta ação não pode ser desfeita.`,
      confirmLabel: `Excluir ${ids.length}`,
      tone: "danger",
    });
    if (!ok) return;

    start(async () => {
      const res = await deleteProducts(ids);
      setSelected(new Set());
      push(`${res.deleted} produto${res.deleted !== 1 ? "s" : ""} excluído${res.deleted !== 1 ? "s" : ""}`);
    });
  }

  async function handleSingleDelete(id: string, name: string) {
    const ok = await confirm({
      title: `Excluir "${name}"?`,
      description: "O produto e todas as imagens vinculadas serão removidos.\n\nEsta ação não pode ser desfeita.",
      confirmLabel: "Excluir",
      tone: "danger",
    });
    if (!ok) return;
    start(async () => {
      await deleteProduct(id);
      const next = new Set(selected);
      next.delete(id);
      setSelected(next);
      push("Produto excluído");
    });
  }

  const hasFilters = search || catFilter !== "all" || statusFilter !== "all";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white border border-brown/10 p-4 space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, descrição ou tag…"
              className="w-full pl-9 pr-3 py-2 border border-brown/20 bg-white text-sm focus:outline-none focus:border-orange"
            />
          </div>

          {/* Category filter */}
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="border border-brown/20 bg-white text-sm px-3 py-2 focus:outline-none focus:border-orange"
          >
            <option value="all">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="border border-brown/20 bg-white text-sm px-3 py-2 focus:outline-none focus:border-orange"
          >
            <option value="all">Todos status</option>
            <option value="published">Publicados</option>
            <option value="draft">Rascunhos</option>
            <option value="featured">Em destaque</option>
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-orange hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Limpar
            </button>
          )}
        </div>

        {/* Counter + bulk actions */}
        <div className="flex items-center justify-between text-xs">
          <div className="text-brown/60">
            {hasFilters ? (
              <>
                <span className="font-semibold text-brown">{filtered.length}</span> de{" "}
                <span>{products.length}</span> produtos
              </>
            ) : (
              <>
                <span className="font-semibold text-brown">{products.length}</span> produtos no total
              </>
            )}
          </div>

          {someSelected && (
            <div className="flex items-center gap-3 bg-orange/10 border border-orange/30 px-3 py-1.5">
              <span className="text-orange font-semibold">
                {selected.size} selecionado{selected.size > 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setSelected(new Set())}
                className="text-brown/60 hover:text-brown"
              >
                limpar
              </button>
              <span className="text-brown/30">|</span>
              <button
                onClick={handleBulkDelete}
                disabled={pending}
                className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 disabled:opacity-50"
              >
                <Trash2 className="w-3 h-3" /> Excluir selecionados
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-brown/10 p-16 text-center">
          <p className="text-brown/40 mb-4">
            {hasFilters ? "Nenhum produto encontrado com esses filtros." : "Nenhum produto cadastrado."}
          </p>
          {hasFilters ? (
            <button onClick={clearFilters} className="btn-outline text-xs">Limpar filtros</button>
          ) : (
            <Link href="/gestao/produtos/novo" className="btn-orange">Criar primeiro produto</Link>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white border border-brown/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-cream-dark border-b border-brown/10">
                <tr>
                  <th className="w-10 px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={allOnPageSelected}
                      onChange={toggleAllOnPage}
                      className="w-4 h-4 accent-orange"
                      title={allOnPageSelected ? "Desmarcar todos da página" : "Selecionar todos da página"}
                    />
                  </th>
                  <th className="text-left px-3 py-3 text-xs tracking-widest text-brown/60 font-semibold uppercase w-16">Foto</th>
                  <th className="text-left px-3 py-3 text-xs tracking-widest text-brown/60 font-semibold uppercase">Nome</th>
                  <th className="text-left px-3 py-3 text-xs tracking-widest text-brown/60 font-semibold uppercase hidden md:table-cell">Categoria</th>
                  <th className="text-left px-3 py-3 text-xs tracking-widest text-brown/60 font-semibold uppercase hidden lg:table-cell">Subcategoria</th>
                  <th className="text-center px-3 py-3 text-xs tracking-widest text-brown/60 font-semibold uppercase w-28">Status</th>
                  <th className="px-3 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brown/5">
                {pageItems.map((p) => {
                  const cat = catMap[p.category];
                  const sub = cat?.subcategories.find((s) => s.slug === p.subcategory);
                  const isSelected = selected.has(p.id);
                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors ${isSelected ? "bg-orange/5" : "hover:bg-cream-light/60"}`}
                    >
                      <td className="px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(p.id)}
                          className="w-4 h-4 accent-orange"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="w-12 h-12 bg-cream-dark border border-brown/10 overflow-hidden flex-shrink-0">
                          {p.image
                            ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-brown/20 text-[10px]">—</div>
                          }
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium text-brown">{p.name}</div>
                            {p.shortDescription && (
                              <div className="text-xs text-brown/50 mt-0.5 line-clamp-1 max-w-md">{p.shortDescription}</div>
                            )}
                          </div>
                          {p.featured && <Star className="w-3 h-3 text-orange fill-orange flex-shrink-0" />}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-brown/70 hidden md:table-cell">{cat?.name ?? "—"}</td>
                      <td className="px-3 py-3 text-brown/70 hidden lg:table-cell text-xs">{sub?.name ?? "—"}</td>
                      <td className="px-3 py-3 text-center">
                        {p.published
                          ? <span className="inline-block bg-orange/10 text-orange text-[10px] tracking-widest px-2 py-0.5 font-semibold">ATIVO</span>
                          : <span className="inline-block bg-brown/10 text-brown/50 text-[10px] tracking-widest px-2 py-0.5 font-semibold">RASCUNHO</span>
                        }
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/gestao/produtos/${p.id}`}
                            className="p-1.5 text-brown/50 hover:text-orange border border-transparent hover:border-orange transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleSingleDelete(p.id, p.name)}
                            disabled={pending}
                            className="p-1.5 text-brown/50 hover:text-red-600 border border-transparent hover:border-red-200 transition-colors disabled:opacity-50"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-brown/60">
              <div>
                Mostrando {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} de {filtered.length}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 border border-brown/20 hover:border-orange hover:text-orange disabled:opacity-30 disabled:hover:border-brown/20 disabled:hover:text-brown/60"
                >
                  ← Anterior
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 ${i === page ? "bg-orange text-white" : "border border-brown/20 hover:border-orange"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1}
                  className="px-3 py-1 border border-brown/20 hover:border-orange hover:text-orange disabled:opacity-30 disabled:hover:border-brown/20 disabled:hover:text-brown/60"
                >
                  Próxima →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
