"use client";

import { useRef, useState, useTransition } from "react";
import { Plus, X, Pencil, Trash2, ChevronDown, Lamp, Wrench, Tags, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/gestao/Toast";
import { useConfirm } from "@/components/gestao/ConfirmDialog";
import { Field, inputCls } from "@/components/gestao/Field";
import { compressImage } from "@/lib/client-image";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  removeSubcategory,
  setSubcategoryImage,
  setCategoryImage,
} from "@/app/gestao/(panel)/actions";
import type { Category, Product, Subcategory } from "@/lib/types";

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

      {/* Expanded content — ver SubcategoryRow no fim do arquivo */}
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

          {/* Foto do painel de nível 1 (página de produtos) */}
          <CategoryImageEditor catSlug={category.slug} catName={category.name} initial={category.image} />

          {/* Subcategorias */}
          <div className="border-t border-brown/10 pt-5">
            <h3 className="text-xs tracking-widest font-semibold text-brown/60 uppercase mb-3">
              Subcategorias ({category.subcategories.length})
            </h3>

            <div className="space-y-2 mb-4">
              {category.subcategories.length === 0 ? (
                <span className="text-xs text-brown/40 italic">Nenhuma subcategoria cadastrada.</span>
              ) : (
                category.subcategories.map((sc) => (
                  <SubcategoryRow
                    key={sc.slug}
                    catSlug={category.slug}
                    sub={sc}
                    disabled={pending}
                    onRemove={() => handleRemoveSub(sc.slug, sc.name)}
                  />
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

/**
 * Foto do painel de nível 1 da categoria (aparece em /produtos).
 * Vazio = usa a imagem padrão do site. Upload otimizado (WebP → bucket); só a URL vai pro banco.
 */
function CategoryImageEditor({
  catSlug,
  catName,
  initial,
}: {
  catSlug: string;
  catName: string;
  initial?: string;
}) {
  const { push } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [img, setImg] = useState(initial ?? "");

  async function upload(file: File) {
    setBusy(true);
    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append("file", compressed);
      fd.append("folder", "site");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.url) {
        push(json.error ?? "Erro no upload", "error");
        return;
      }
      const r = await setCategoryImage(catSlug, json.url);
      if ("error" in r) { push(r.error, "error"); return; }
      setImg(json.url);
      push("Foto da categoria salva!");
    } finally {
      setBusy(false);
    }
  }

  async function clearImg() {
    setBusy(true);
    const r = await setCategoryImage(catSlug, "");
    setBusy(false);
    if ("error" in r) { push(r.error, "error"); return; }
    setImg("");
    push("Foto removida");
  }

  return (
    <div className="border-t border-brown/10 pt-5">
      <h3 className="text-xs tracking-widest font-semibold text-brown/60 uppercase mb-3">
        Foto do painel (página de produtos)
      </h3>
      <div className="flex items-center gap-4 bg-white border border-brown/15 rounded-lg p-3">
        {/* Preview em proporção parecida com o painel */}
        <div className="w-28 h-16 rounded overflow-hidden bg-cream-dark flex items-center justify-center flex-shrink-0">
          {img ? (
            <img src={img} alt={catName} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-brown/25" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-brown truncate">{catName}</div>
          <div className="text-[11px] text-brown/40">
            {img ? "Foto personalizada do painel" : "Sem foto — usa a imagem padrão do site"}
          </div>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="text-xs text-orange hover:underline disabled:opacity-40 whitespace-nowrap"
        >
          {busy ? "Enviando…" : img ? "Trocar foto" : "Adicionar foto"}
        </button>
        {img && (
          <button
            type="button"
            onClick={clearImg}
            disabled={busy}
            className="text-xs text-brown/50 hover:text-red-600 disabled:opacity-40 whitespace-nowrap"
          >
            Remover
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

/**
 * Linha de subcategoria com foto (usada nos painéis do catálogo).
 * Upload otimizado (WebP → bucket); só a URL vai pro banco.
 */
function SubcategoryRow({
  catSlug,
  sub,
  disabled,
  onRemove,
}: {
  catSlug: string;
  sub: Subcategory;
  disabled: boolean;
  onRemove: () => void;
}) {
  const { push } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [img, setImg] = useState(sub.image ?? "");

  async function upload(file: File) {
    setBusy(true);
    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append("file", compressed);
      fd.append("folder", "site");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.url) {
        push(json.error ?? "Erro no upload", "error");
        return;
      }
      const r = await setSubcategoryImage(catSlug, sub.slug, json.url);
      if ("error" in r) { push(r.error, "error"); return; }
      setImg(json.url);
      push("Foto da subcategoria salva!");
    } finally {
      setBusy(false);
    }
  }

  async function clearImg() {
    setBusy(true);
    const r = await setSubcategoryImage(catSlug, sub.slug, "");
    setBusy(false);
    if ("error" in r) { push(r.error, "error"); return; }
    setImg("");
    push("Foto removida");
  }

  return (
    <div className="flex items-center gap-3 bg-white border border-brown/15 rounded-lg px-3 py-2">
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded overflow-hidden bg-cream-dark flex items-center justify-center flex-shrink-0">
        {img ? (
          <img src={img} alt={sub.name} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-5 h-5 text-brown/25" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-brown truncate">{sub.name}</div>
        <div className="text-[11px] text-brown/40">{img ? "Com foto (painel do catálogo)" : "Sem foto — painel fica com fundo padrão"}</div>
      </div>

      {/* Ações */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={busy || disabled}
        className="text-[11px] text-orange hover:underline disabled:opacity-40 whitespace-nowrap"
      >
        {busy ? "Enviando…" : img ? "Trocar foto" : "Adicionar foto"}
      </button>
      {img && (
        <button
          type="button"
          onClick={clearImg}
          disabled={busy || disabled}
          className="text-[11px] text-brown/50 hover:text-red-600 disabled:opacity-40 whitespace-nowrap"
        >
          Remover foto
        </button>
      )}
      <button
        type="button"
        onClick={onRemove}
        disabled={busy || disabled}
        className="text-brown/40 hover:text-red-600 p-1 disabled:opacity-40"
        title="Remover subcategoria"
        aria-label={`Remover subcategoria ${sub.name}`}
      >
        <X className="w-4 h-4" />
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
