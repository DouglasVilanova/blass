"use client";

import { useState, useTransition } from "react";
import { Plus, X, Pencil, Trash2, ChevronDown, Lamp, Wrench, Tags, Loader2 } from "lucide-react";
import { useToast } from "@/components/gestao/Toast";
import { useConfirm } from "@/components/gestao/ConfirmDialog";
import { Field, inputCls } from "@/components/gestao/Field";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  removeSubcategory,
} from "@/app/gestao/(panel)/actions";
import type { Category, Product } from "@/lib/types";

type Props = {
  categories: Category[];
  productCounts: Record<string, number>;
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  lamp: Lamp,
  wrench: Wrench,
};

export default function CategoriasManager({ categories, productCounts }: Props) {
  const [creating, setCreating] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { push } = useToast();
  const [pending, start] = useTransition();

  async function handleCreate(fd: FormData) {
    start(async () => {
      await createCategory(fd);
      setCreating(false);
      push("Categoria criada");
    });
  }

  return (
    <div className="space-y-6">
      {/* Header com botão */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-brown/60">
          <span className="font-semibold text-brown">{categories.length}</span> categoria{categories.length !== 1 ? "s" : ""} ·{" "}
          <span className="font-semibold text-brown">
            {categories.reduce((n, c) => n + c.subcategories.length, 0)}
          </span>{" "}
          subcategorias
        </div>
        {!creating && (
          <button onClick={() => setCreating(true)} className="btn-orange flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nova categoria
          </button>
        )}
      </div>

      {/* Form de criação (inline, só quando ativado) */}
      {creating && (
        <section className="bg-white border-2 border-orange p-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-brown">Nova categoria</h2>
            <button
              onClick={() => setCreating(false)}
              className="text-brown/40 hover:text-brown"
              title="Cancelar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form action={handleCreate} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Nome">
                <input name="name" className={inputCls} required autoFocus />
              </Field>
              <Field label="Slug" hint="Vazio = gerado do nome.">
                <input name="slug" className={inputCls} />
              </Field>
              <Field label="Ícone">
                <select name="icon" className={inputCls}>
                  <option value="lamp">Lâmpada</option>
                  <option value="wrench">Ferramenta</option>
                </select>
              </Field>
            </div>
            <Field label="Descrição">
              <input name="description" className={inputCls} placeholder="Texto curto exibido no card da home" />
            </Field>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={pending} className="btn-orange flex items-center gap-2 disabled:opacity-50">
                {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {pending ? "Criando…" : "Criar categoria"}
              </button>
              <button type="button" onClick={() => setCreating(false)} className="text-sm text-brown/60 hover:text-brown underline">
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Lista accordion */}
      {categories.length === 0 ? (
        <div className="bg-white border border-brown/10 p-16 text-center">
          <Tags className="w-12 h-12 text-brown/20 mx-auto mb-3" />
          <p className="text-brown/40 mb-4">Nenhuma categoria cadastrada.</p>
          {!creating && (
            <button onClick={() => setCreating(true)} className="btn-orange">
              Criar primeira categoria
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-brown/10 divide-y divide-brown/10">
          {categories.map((c) => (
            <CategoryRow
              key={c.slug}
              category={c}
              productCount={productCounts[c.slug] ?? 0}
              isOpen={expanded === c.slug}
              onToggle={() => setExpanded(expanded === c.slug ? null : c.slug)}
              onDeleted={() => setExpanded(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryRow({
  category,
  productCount,
  isOpen,
  onToggle,
  onDeleted,
}: {
  category: Category;
  productCount: number;
  isOpen: boolean;
  onToggle: () => void;
  onDeleted: () => void;
}) {
  const Icon = ICONS[category.icon ?? "lamp"] ?? Lamp;
  const { push } = useToast();
  const confirm = useConfirm();
  const [pending, start] = useTransition();
  const [newSubName, setNewSubName] = useState("");

  async function handleSaveEdit(fd: FormData) {
    start(async () => {
      await updateCategory(category.slug, fd);
      push("Categoria atualizada");
    });
  }

  async function handleDelete() {
    const ok = await confirm({
      title: `Excluir categoria "${category.name}"?`,
      description: productCount > 0
        ? `Todos os ${productCount} produto${productCount > 1 ? "s" : ""} vinculado${productCount > 1 ? "s" : ""} também ser${productCount > 1 ? "ão" : "á"} excluído${productCount > 1 ? "s" : ""}.\n\nEsta ação não pode ser desfeita.`
        : "Esta ação não pode ser desfeita.",
      confirmLabel: "Excluir categoria",
      tone: "danger",
    });
    if (!ok) return;
    start(async () => {
      await deleteCategory(category.slug);
      onDeleted();
      push("Categoria excluída");
    });
  }

  async function handleAddSub() {
    if (!newSubName.trim()) return;
    const fd = new FormData();
    fd.set("name", newSubName);
    start(async () => {
      await addSubcategory(category.slug, fd);
      setNewSubName("");
      push("Subcategoria adicionada");
    });
  }

  async function handleRemoveSub(subSlug: string, subName: string) {
    const ok = await confirm({
      title: `Remover subcategoria "${subName}"?`,
      description: "Produtos vinculados a esta subcategoria ficarão sem subcategoria, mas não serão excluídos.",
      confirmLabel: "Remover",
      tone: "danger",
    });
    if (!ok) return;
    start(async () => {
      await removeSubcategory(category.slug, subSlug);
      push("Subcategoria removida");
    });
  }

  return (
    <div>
      {/* Row header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-cream-light/60 transition-colors ${isOpen ? "bg-cream-light/40" : ""}`}
      >
        <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center text-orange flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-brown">{category.name}</div>
          {category.description && (
            <div className="text-xs text-brown/50 line-clamp-1 mt-0.5">{category.description}</div>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-brown/60">
          <span><strong className="text-brown">{productCount}</strong> produto{productCount !== 1 ? "s" : ""}</span>
          <span><strong className="text-brown">{category.subcategories.length}</strong> subcategoria{category.subcategories.length !== 1 ? "s" : ""}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-brown/40 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="px-5 pb-6 pt-2 bg-cream-light/20 space-y-6 animate-in fade-in slide-in-from-top-1 duration-150">

          {/* Edit form */}
          <form action={handleSaveEdit} className="grid md:grid-cols-3 gap-4">
            <Field label="Nome">
              <input name="name" defaultValue={category.name} className={inputCls} />
            </Field>
            <Field label="Ícone">
              <select name="icon" defaultValue={category.icon ?? "lamp"} className={inputCls}>
                <option value="lamp">Lâmpada</option>
                <option value="wrench">Ferramenta</option>
              </select>
            </Field>
            <Field label="Descrição">
              <input name="description" defaultValue={category.description} className={inputCls} />
            </Field>
            <div className="md:col-span-3 flex items-center justify-between pt-2">
              <button type="submit" disabled={pending} className="btn-orange flex items-center gap-2 disabled:opacity-50">
                {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
                Salvar alterações
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={pending}
                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" /> Excluir categoria
              </button>
            </div>
          </form>

          {/* Subcategorias */}
          <div className="border-t border-brown/10 pt-5">
            <h3 className="text-xs tracking-widest font-semibold text-brown/60 uppercase mb-3">
              Subcategorias ({category.subcategories.length})
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              {category.subcategories.length === 0 ? (
                <span className="text-xs text-brown/40 italic">Nenhuma subcategoria cadastrada.</span>
              ) : (
                category.subcategories.map((sc) => (
                  <button
                    key={sc.slug}
                    onClick={() => handleRemoveSub(sc.slug, sc.name)}
                    disabled={pending}
                    className="group flex items-center gap-2 text-xs px-3 py-1.5 bg-white border border-brown/20 hover:border-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                    title="Clique para remover"
                  >
                    {sc.name}
                    <X className="w-3 h-3 text-brown/40 group-hover:text-red-600" />
                  </button>
                ))
              )}
            </div>

            {/* Add subcategoria inline */}
            <div className="flex gap-2 max-w-md">
              <input
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSub();
                  }
                }}
                placeholder="Nome da nova subcategoria"
                className={inputCls + " flex-1"}
              />
              <button
                onClick={handleAddSub}
                disabled={pending || !newSubName.trim()}
                className="btn-outline text-xs px-4 disabled:opacity-50 flex items-center gap-1"
              >
                {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
