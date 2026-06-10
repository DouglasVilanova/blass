"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";
import { Field, inputCls } from "./Field";
import GalleryUpload from "./GalleryUpload";
import { useToast } from "./Toast";
import { createCategoryInline, createSubcategoryInline } from "@/app/gestao/(panel)/actions";
import type { Category, Product } from "@/lib/types";

type Props = {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  initial?: Partial<Product>;
  /** Quantos produtos já estão marcados como destaque (excluindo o atual quando editar) */
  featuredCount?: number;
};

const MAX_FEATURED = 6;

export default function ProductForm({ action, categories: initialCategories, initial, featuredCount = 0 }: Props) {
  // Local categories state — grows as user creates new inline
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [catSlug, setCatSlug] = useState(initial?.category ?? categories[0]?.slug ?? "");
  const [subSlug, setSubSlug] = useState(initial?.subcategory ?? "");

  // Inline creation UI state
  const [newCatOpen, setNewCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatPending, setNewCatPending] = useState(false);

  const [newSubOpen, setNewSubOpen] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubPending, setNewSubPending] = useState(false);
  // Single unified gallery — position 0 is the cover.
  // Migrate legacy: initial.image becomes images[0] if present.
  const [images, setImages] = useState<string[]>(() => {
    const cover = initial?.image ? [initial.image] : [];
    const rest = initial?.gallery ?? [];
    return [...cover, ...rest];
  });
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [pending, setPending] = useState(false);
  const { push } = useToast();
  const router = useRouter();

  const currentCat = categories.find((c) => c.slug === catSlug);
  const subs = currentCat?.subcategories ?? [];

  async function handleCreateCategory() {
    if (!newCatName.trim()) return;
    setNewCatPending(true);
    const res = await createCategoryInline(newCatName);
    setNewCatPending(false);
    if ("error" in res) {
      push(res.error, "error");
      return;
    }
    // Add to local list and select it
    const newCat: Category = { slug: res.slug, name: res.name, icon: "lamp", subcategories: [] };
    setCategories([...categories, newCat]);
    setCatSlug(res.slug);
    setSubSlug("");
    setNewCatName("");
    setNewCatOpen(false);
    push(`Categoria "${res.name}" criada`);
  }

  async function handleCreateSubcategory() {
    if (!newSubName.trim() || !catSlug) return;
    setNewSubPending(true);
    const res = await createSubcategoryInline(catSlug, newSubName);
    setNewSubPending(false);
    if ("error" in res) {
      push(res.error, "error");
      return;
    }
    // Update local category and select new sub
    setCategories(categories.map((c) =>
      c.slug === catSlug
        ? { ...c, subcategories: [...c.subcategories, { slug: res.slug, name: res.name }] }
        : c
    ));
    setSubSlug(res.slug);
    setNewSubName("");
    setNewSubOpen(false);
    push(`Subcategoria "${res.name}" criada`);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const fd = new FormData(e.currentTarget);
      // Position 0 = cover (saved as product.image)
      // Positions 1+ = additional gallery
      fd.set("image", images[0] ?? "");
      fd.set("gallery", JSON.stringify(images.slice(1)));
      fd.set("category", catSlug);
      fd.set("subcategory", subSlug);
      fd.set("tags", JSON.stringify(tags));
      await action(fd);
    } catch (err: any) {
      push(err?.message ?? "Erro ao salvar", "error");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-4xl space-y-8">

      {/* Fotos do produto */}
      <section className="bg-white border border-brown/10 p-6">
        <h2 className="font-display text-lg text-brown mb-4">Fotos do produto</h2>
        <GalleryUpload value={images} onChange={setImages} folder="products" />
      </section>

      {/* Identificação */}
      <section className="bg-white border border-brown/10 p-6 grid md:grid-cols-2 gap-5">
        <h2 className="font-display text-lg text-brown md:col-span-2">Identificação</h2>

        <Field label="Nome do produto">
          <input name="name" className={inputCls} defaultValue={initial?.name} required />
        </Field>

        <Field label="Slug (URL)" hint="Vazio → gerado do nome automaticamente.">
          <input name="slug" className={inputCls} defaultValue={initial?.slug} />
        </Field>

        {/* Categoria — com opção de criar nova inline */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs tracking-widest text-brown/70 font-semibold uppercase">Categoria</label>
            {!newCatOpen && (
              <button
                type="button"
                onClick={() => setNewCatOpen(true)}
                className="text-[11px] text-orange hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Criar nova
              </button>
            )}
          </div>

          {newCatOpen ? (
            <div className="flex gap-1">
              <input
                autoFocus
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); handleCreateCategory(); }
                  if (e.key === "Escape") { setNewCatOpen(false); setNewCatName(""); }
                }}
                placeholder="Nome da nova categoria"
                className={inputCls + " flex-1"}
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={newCatPending || !newCatName.trim()}
                className="bg-orange text-white px-3 text-xs font-semibold disabled:opacity-50 flex items-center gap-1"
              >
                {newCatPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "OK"}
              </button>
              <button
                type="button"
                onClick={() => { setNewCatOpen(false); setNewCatName(""); }}
                className="border border-brown/20 px-2 text-brown/50 hover:bg-cream-dark"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <select
              className={inputCls}
              value={catSlug}
              onChange={(e) => { setCatSlug(e.target.value); setSubSlug(""); }}
            >
              {categories.length === 0 && <option value="">— nenhuma categoria —</option>}
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Subcategoria — com opção de criar nova inline */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs tracking-widest text-brown/70 font-semibold uppercase">Subcategoria</label>
            {!newSubOpen && catSlug && (
              <button
                type="button"
                onClick={() => setNewSubOpen(true)}
                className="text-[11px] text-orange hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Criar nova
              </button>
            )}
          </div>

          {newSubOpen ? (
            <div className="flex gap-1">
              <input
                autoFocus
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); handleCreateSubcategory(); }
                  if (e.key === "Escape") { setNewSubOpen(false); setNewSubName(""); }
                }}
                placeholder={`Nova subcategoria em ${currentCat?.name ?? ""}`}
                className={inputCls + " flex-1"}
              />
              <button
                type="button"
                onClick={handleCreateSubcategory}
                disabled={newSubPending || !newSubName.trim()}
                className="bg-orange text-white px-3 text-xs font-semibold disabled:opacity-50 flex items-center gap-1"
              >
                {newSubPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "OK"}
              </button>
              <button
                type="button"
                onClick={() => { setNewSubOpen(false); setNewSubName(""); }}
                className="border border-brown/20 px-2 text-brown/50 hover:bg-cream-dark"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <select
              className={inputCls}
              value={subSlug}
              onChange={(e) => setSubSlug(e.target.value)}
              disabled={!catSlug}
            >
              <option value="">— nenhuma —</option>
              {subs.map((s) => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>
          )}
        </div>
      </section>

      {/* Descrições */}
      <section className="bg-white border border-brown/10 p-6 space-y-5">
        <h2 className="font-display text-lg text-brown">Descrição</h2>

        <Field label="Descrição curta" hint="Exibida na listagem de produtos (máx. 2 linhas).">
          <input name="shortDescription" className={inputCls} defaultValue={initial?.shortDescription} />
        </Field>

        <Field label="Descrição completa" hint="Exibida na página do produto.">
          <textarea
            name="description"
            className={inputCls + " min-h-[180px]"}
            defaultValue={initial?.description}
          />
        </Field>
      </section>

      {/* Tags */}
      <section className="bg-white border border-brown/10 p-6 space-y-4">
        <h2 className="font-display text-lg text-brown">Características / Tags</h2>
        <p className="text-xs text-brown/50">Use para cor, material, tamanho, tipo… Ex: "Preto", "Alumínio", "3mm". Aparecem como filtro na loja.</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-xs bg-cream-dark border border-brown/20 px-2.5 py-1">
              {t}
              <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))} className="text-brown/40 hover:text-red-600">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 max-w-sm">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                e.preventDefault();
                const t = tagInput.trim().replace(/,$/, "");
                if (!tags.includes(t)) setTags([...tags, t]);
                setTagInput("");
              }
            }}
            placeholder="Digite e pressione Enter"
            className="border border-brown/20 px-3 py-2 text-sm flex-1 focus:outline-none focus:border-orange"
          />
          <button
            type="button"
            onClick={() => {
              const t = tagInput.trim();
              if (t && !tags.includes(t)) setTags([...tags, t]);
              setTagInput("");
            }}
            className="btn-outline text-xs px-4"
          >
            Adicionar
          </button>
        </div>
      </section>

      {/* Opções */}
      <section className="bg-white border border-brown/10 p-6">
        <h2 className="font-display text-lg text-brown mb-4">Opções</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              defaultChecked={initial?.published ?? true}
              className="w-4 h-4 accent-orange"
            />
            <span className="text-sm font-medium">Publicado <span className="text-brown/50 font-normal">(visível no site)</span></span>
          </label>

          <div>
            <label className={`flex items-center gap-3 ${featuredCount >= MAX_FEATURED && !initial?.featured ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
              <input
                type="checkbox"
                name="featured"
                defaultChecked={initial?.featured}
                disabled={featuredCount >= MAX_FEATURED && !initial?.featured}
                className="w-4 h-4 accent-orange disabled:opacity-50"
              />
              <span className="text-sm font-medium">
                Destaque <span className="text-brown/50 font-normal">(aparece no carrossel da home)</span>
              </span>
            </label>
            <div className="ml-7 mt-1 text-xs text-brown/50">
              {featuredCount >= MAX_FEATURED && !initial?.featured ? (
                <span className="text-red-600">
                  Limite de {MAX_FEATURED} destaques atingido. Remova outro destaque antes de marcar este.
                </span>
              ) : (
                <>Limite: <strong className="text-brown">{featuredCount}/{MAX_FEATURED}</strong> produtos em destaque.</>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Ações */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="btn-orange disabled:opacity-50 min-w-[120px]"
        >
          {pending ? "Salvando…" : "Salvar produto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/gestao/produtos")}
          className="text-sm text-brown/60 hover:text-brown underline"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
