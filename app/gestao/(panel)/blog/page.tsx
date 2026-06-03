import Link from "next/link";
import { readStore } from "@/lib/store";
import { createBlogCategory, deleteBlogCategory, deletePost } from "../actions";
import { Field, inputCls } from "@/components/gestao/Field";

export default async function BlogAdmin() {
  const { blogPosts, blogCategories } = await readStore();
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Blog</h1>
        <Link href="/gestao/blog/novo" className="btn-orange">Novo post</Link>
      </div>

      <section>
        <h2 className="font-display text-xl mb-4">Categorias do blog</h2>
        <div className="flex flex-wrap gap-2">
          {blogCategories.map((c) => (
            <form key={c.slug} action={async () => { "use server"; await deleteBlogCategory(c.slug); }} className="inline">
              <button className="group flex items-center gap-2 text-xs px-3 py-1 bg-white border border-brown/20 hover:border-red-500 hover:text-red-600">
                {c.name} <span className="text-brown/40 group-hover:text-red-600">×</span>
              </button>
            </form>
          ))}
        </div>
        <form action={createBlogCategory} className="mt-4 flex gap-2">
          <input name="name" className={inputCls + " max-w-xs"} placeholder="Nome" />
          <input name="slug" className={inputCls + " max-w-xs"} placeholder="slug (opcional)" />
          <button className="btn-outline text-xs px-4 py-2">Adicionar</button>
        </form>
      </section>

      <section>
        <h2 className="font-display text-xl mb-4">Posts</h2>
        <table className="w-full bg-white border border-brown/10 text-sm">
          <thead className="bg-cream-dark text-xs tracking-widest">
            <tr>
              <th className="text-left p-3">Título</th>
              <th className="text-left p-3">Categoria</th>
              <th className="text-left p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {blogPosts.map((p) => {
              const cat = blogCategories.find((c) => c.slug === p.category);
              return (
                <tr key={p.id} className="border-t border-brown/10">
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3 text-brown/70">{cat?.name ?? "—"}</td>
                  <td className="p-3">{p.published ? <span className="text-orange">publicado</span> : <span className="text-brown/40">rascunho</span>}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Link href={`/gestao/blog/${p.id}`} className="text-orange hover:underline mr-4">Editar</Link>
                    <form action={async () => { "use server"; await deletePost(p.id); }} className="inline">
                      <button className="text-red-600 hover:underline">Excluir</button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {blogPosts.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-brown/50">Nenhum post.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
}
