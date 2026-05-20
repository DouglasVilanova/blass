import { readStore } from "@/lib/store";
import { addSubcategory, createCategory, deleteCategory, removeSubcategory, updateCategory } from "../actions";
import { Field, inputCls } from "@/components/gestao/Field";

export default async function CategoriasAdmin() {
  const { categories } = await readStore();
  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-3xl">Categorias</h1>
        <p className="text-brown/70 mt-2">Gerencie categorias e subcategorias de produtos.</p>
      </div>

      <section className="bg-white border border-brown/10 p-6">
        <h2 className="font-display text-xl mb-4">Nova categoria</h2>
        <form action={createCategory} className="grid md:grid-cols-4 gap-4">
          <Field label="Nome"><input name="name" className={inputCls} required /></Field>
          <Field label="Slug"><input name="slug" className={inputCls} /></Field>
          <Field label="Ícone"><select name="icon" className={inputCls}><option value="lamp">Lâmpada</option><option value="wrench">Ferramenta</option></select></Field>
          <div className="flex items-end"><button className="btn-orange w-full">Criar</button></div>
          <div className="md:col-span-4">
            <Field label="Descrição"><input name="description" className={inputCls} /></Field>
          </div>
        </form>
      </section>

      {categories.map((c) => (
        <section key={c.slug} className="bg-white border border-brown/10 p-6">
          <form
            action={async (fd: FormData) => { "use server"; await updateCategory(c.slug, fd); }}
            className="grid md:grid-cols-4 gap-4"
          >
            <Field label="Nome"><input name="name" defaultValue={c.name} className={inputCls} /></Field>
            <Field label="Ícone">
              <select name="icon" defaultValue={c.icon ?? "lamp"} className={inputCls}>
                <option value="lamp">Lâmpada</option>
                <option value="wrench">Ferramenta</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Descrição"><input name="description" defaultValue={c.description} className={inputCls} /></Field>
            </div>
            <div className="md:col-span-4">
              <button className="btn-orange" type="submit">Salvar categoria</button>
            </div>
          </form>
          <form action={async () => { "use server"; await deleteCategory(c.slug); }} className="mt-3">
            <button className="text-red-600 hover:underline text-sm">Excluir categoria e produtos</button>
          </form>

          <div className="mt-8 border-t border-brown/10 pt-6">
            <h3 className="text-sm tracking-widest font-semibold text-brown/70 uppercase">Subcategorias</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {c.subcategories.map((sc) => (
                <form
                  key={sc.slug}
                  action={async () => { "use server"; await removeSubcategory(c.slug, sc.slug); }}
                  className="inline"
                >
                  <button className="group flex items-center gap-2 text-xs px-3 py-1 border border-brown/20 hover:border-red-500 hover:text-red-600">
                    {sc.name} <span className="text-brown/40 group-hover:text-red-600">×</span>
                  </button>
                </form>
              ))}
              {c.subcategories.length === 0 && <span className="text-xs text-brown/40">nenhuma</span>}
            </div>
            <form
              action={async (fd: FormData) => { "use server"; await addSubcategory(c.slug, fd); }}
              className="mt-4 flex gap-2"
            >
              <input name="name" placeholder="Nova subcategoria" className={inputCls + " max-w-xs"} />
              <input name="slug" placeholder="slug (opcional)" className={inputCls + " max-w-xs"} />
              <button className="btn-outline text-xs px-4 py-2">Adicionar</button>
            </form>
          </div>
        </section>
      ))}
    </div>
  );
}
