import Link from "next/link";
import { readStore } from "@/lib/store";
import { deleteProduct } from "../actions";

export default async function ProdutosAdmin() {
  const { products, categories } = await readStore();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Produtos</h1>
        <Link href="/gestao/produtos/novo" className="btn-orange">Novo produto</Link>
      </div>

      <table className="mt-8 w-full bg-white border border-brown/10 text-sm">
        <thead className="bg-cream-dark text-brown text-xs tracking-widest">
          <tr>
            <th className="text-left p-3">Nome</th>
            <th className="text-left p-3">Categoria</th>
            <th className="text-left p-3">Subcategoria</th>
            <th className="text-left p-3">Publicado</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const cat = categories.find((c) => c.slug === p.category);
            const sub = cat?.subcategories.find((s) => s.slug === p.subcategory);
            return (
              <tr key={p.id} className="border-t border-brown/10">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-brown/70">{cat?.name ?? "—"}</td>
                <td className="p-3 text-brown/70">{sub?.name ?? "—"}</td>
                <td className="p-3">{p.published ? <span className="text-orange">●</span> : <span className="text-brown/30">○</span>}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Link href={`/gestao/produtos/${p.id}`} className="text-orange hover:underline mr-4">Editar</Link>
                  <form action={async () => { "use server"; await deleteProduct(p.id); }} className="inline">
                    <button type="submit" className="text-red-600 hover:underline">Excluir</button>
                  </form>
                </td>
              </tr>
            );
          })}
          {products.length === 0 && (
            <tr><td colSpan={5} className="p-6 text-center text-brown/50">Nenhum produto cadastrado.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
