"use client";

import { useState } from "react";
import { Field, inputCls } from "./Field";
import type { Category, Product } from "@/lib/types";

export default function ProductForm({
  action,
  categories,
  initial,
}: {
  action: (formData: FormData) => void | Promise<void>;
  categories: Category[];
  initial?: Partial<Product>;
}) {
  const [cat, setCat] = useState(initial?.category ?? categories[0]?.slug ?? "");
  const subs = categories.find((c) => c.slug === cat)?.subcategories ?? [];

  return (
    <form action={action} className="grid md:grid-cols-2 gap-6 max-w-4xl">
      <Field label="Nome">
        <input name="name" className={inputCls} defaultValue={initial?.name} required />
      </Field>
      <Field label="Slug (URL)" hint="Deixe vazio para gerar do nome.">
        <input name="slug" className={inputCls} defaultValue={initial?.slug} />
      </Field>

      <Field label="Categoria">
        <select name="category" className={inputCls} value={cat} onChange={(e) => setCat(e.target.value)}>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </Field>
      <Field label="Subcategoria">
        <select name="subcategory" className={inputCls} defaultValue={initial?.subcategory ?? ""}>
          <option value="">—</option>
          {subs.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>
      </Field>

      <Field label="Imagem (URL)">
        <input name="image" className={inputCls} defaultValue={initial?.image} placeholder="/images/products/..." />
      </Field>
      <div />

      <div className="md:col-span-2">
        <Field label="Descrição curta">
          <input name="shortDescription" className={inputCls} defaultValue={initial?.shortDescription} />
        </Field>
      </div>

      <div className="md:col-span-2">
        <Field label="Descrição completa">
          <textarea name="description" className={inputCls + " min-h-[160px]"} defaultValue={initial?.description} />
        </Field>
      </div>

      <Field label="Opções">
        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="published" defaultChecked={initial?.published ?? true} /> Publicado
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" defaultChecked={initial?.featured} /> Destaque
          </label>
        </div>
      </Field>

      <div className="md:col-span-2 flex gap-3 mt-4">
        <button type="submit" className="btn-orange">Salvar</button>
      </div>
    </form>
  );
}
