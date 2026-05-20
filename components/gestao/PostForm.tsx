import { Field, inputCls } from "./Field";
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
  return (
    <form action={action} className="grid md:grid-cols-2 gap-6 max-w-4xl">
      <Field label="Título"><input name="title" className={inputCls} defaultValue={initial?.title} required /></Field>
      <Field label="Slug"><input name="slug" className={inputCls} defaultValue={initial?.slug} /></Field>
      <Field label="Categoria">
        <select name="category" className={inputCls} defaultValue={initial?.category ?? ""}>
          <option value="">—</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </Field>
      <Field label="Imagem de capa (URL)"><input name="coverImage" className={inputCls} defaultValue={initial?.coverImage} /></Field>
      <div className="md:col-span-2"><Field label="Resumo"><input name="excerpt" className={inputCls} defaultValue={initial?.excerpt} /></Field></div>
      <div className="md:col-span-2"><Field label="Conteúdo"><textarea name="body" className={inputCls + " min-h-[260px]"} defaultValue={initial?.body} /></Field></div>
      <Field label="Status">
        <label className="flex items-center gap-2 text-sm mt-1">
          <input type="checkbox" name="published" defaultChecked={initial?.published} /> Publicado
        </label>
      </Field>
      <div className="md:col-span-2"><button className="btn-orange">Salvar</button></div>
    </form>
  );
}
