"use client";

import { useState } from "react";
import { Field, inputCls } from "./Field";
import ImageUpload from "./ImageUpload";
import type { BlogCategory, BlogPost } from "@/lib/types";

export default function PostForm({
  action,
  categories,
  initial,
}: {
  action: (fd: FormData) => void | Promise<void>;
  categories: BlogCategory[];
  initial?: Partial<BlogPost>;
}) {
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("coverImage", coverImage);
    await action(fd);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      {/* Capa */}
      <section className="bg-white border border-brown/10 p-6">
        <h2 className="font-display text-lg text-brown mb-4">Imagem de capa</h2>
        <ImageUpload
          label="Capa do post"
          value={coverImage}
          onChange={setCoverImage}
          folder="blog"
          aspect="wide"
          recommended="1200 × 675 px (16:9)"
          hint="Aparece na listagem do blog e como Open Graph image no compartilhamento."
        />
      </section>

      {/* Conteúdo */}
      <section className="bg-white border border-brown/10 p-6 grid md:grid-cols-2 gap-5">
        <h2 className="font-display text-lg text-brown md:col-span-2">Conteúdo</h2>
        <Field label="Título"><input name="title" className={inputCls} defaultValue={initial?.title} required /></Field>
        <Field label="Slug" hint="Vazio = gerado do título."><input name="slug" className={inputCls} defaultValue={initial?.slug} /></Field>
        <Field label="Categoria">
          <select name="category" className={inputCls} defaultValue={initial?.category ?? ""}>
            <option value="">—</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <label className="flex items-center gap-2 text-sm mt-2">
            <input type="checkbox" name="published" defaultChecked={initial?.published} className="w-4 h-4 accent-orange" /> Publicado
          </label>
        </Field>
        <div className="md:col-span-2">
          <Field label="Resumo"><input name="excerpt" className={inputCls} defaultValue={initial?.excerpt} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Corpo do post"><textarea name="body" className={inputCls + " min-h-[300px]"} defaultValue={initial?.body} /></Field>
        </div>
      </section>

      <button type="submit" className="btn-orange">Salvar post</button>
    </form>
  );
}
