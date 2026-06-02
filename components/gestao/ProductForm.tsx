"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, inputCls } from "./Field";
import ImageUpload from "./ImageUpload";
import { useToast } from "./Toast";
import type { Category, Product } from "@/lib/types";

type Props = {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  initial?: Partial<Product>;
};

export default function ProductForm({ action, categories, initial }: Props) {
  const [catSlug, setCatSlug] = useState(initial?.category ?? categories[0]?.slug ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [pending, setPending] = useState(false);
  const { push } = useToast();
  const router = useRouter();

  const subs = categories.find((c) => c.slug === catSlug)?.subcategories ?? [];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const fd = new FormData(e.currentTarget);
      // Inject image URL (managed by ImageUpload, not a native file input)
      fd.set("image", image);
      fd.set("category", catSlug);
      await action(fd);
    } catch (err: any) {
      push(err?.message ?? "Erro ao salvar", "error");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-4xl space-y-8">

      {/* Imagem */}
      <section className="bg-white border border-brown/10 p-6">
        <h2 className="font-display text-lg text-brown mb-4">Foto do produto</h2>
        <ImageUpload
          value={image}
          onChange={setImage}
          folder="products"
          hint="Máx. 10 MB. Convertida automaticamente para WebP otimizado."
        />
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

        <Field label="Categoria">
          <select
            name="category"
            className={inputCls}
            value={catSlug}
            onChange={(e) => setCatSlug(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Subcategoria">
          <select name="subcategory" className={inputCls} defaultValue={initial?.subcategory ?? ""}>
            <option value="">— nenhuma —</option>
            {subs.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </Field>
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

      {/* Opções */}
      <section className="bg-white border border-brown/10 p-6">
        <h2 className="font-display text-lg text-brown mb-4">Opções</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              defaultChecked={initial?.published ?? true}
              className="w-4 h-4 accent-orange"
            />
            <span className="text-sm font-medium">Publicado <span className="text-brown/50 font-normal">(visível no site)</span></span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={initial?.featured}
              className="w-4 h-4 accent-orange"
            />
            <span className="text-sm font-medium">Destaque <span className="text-brown/50 font-normal">(aparece na home)</span></span>
          </label>
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
