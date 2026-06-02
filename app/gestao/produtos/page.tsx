import Link from "next/link";
import { getCategories, getProducts } from "@/lib/db";
import { deleteProduct } from "@/app/gestao/actions";
import PageHeader from "@/components/gestao/PageHeader";
import { Pencil, Plus, Trash2 } from "lucide-react";

export default async function ProdutosAdmin() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Produtos" subtitle={`${products.length} produto${products.length !== 1 ? "s" : ""} cadastrado${products.length !== 1 ? "s" : ""}`} />
        <Link href="/gestao/produtos/novo" className="btn-orange flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo produto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-brown/10 p-16 text-center">
          <p className="text-brown/40 mb-4">Nenhum produto ainda.</p>
          <Link href="/gestao/produtos/novo" className="btn-orange">Criar primeiro produto</Link>
        </div>
      ) : (
        <div className="bg-white border border-brown/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-dark border-b border-brown/10">
              <tr>
                <th className="text-left px-4 py-3 text-xs tracking-widest text-brown/60 font-semibold uppercase w-16">Foto</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest text-brown/60 font-semibold uppercase">Nome</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest text-brown/60 font-semibold uppercase hidden md:table-cell">Categoria</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest text-brown/60 font-semibold uppercase hidden lg:table-cell">Subcategoria</th>
                <th className="text-center px-4 py-3 text-xs tracking-widest text-brown/60 font-semibold uppercase w-24">Status</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/5">
              {products.map((p) => {
                const cat = categories.find((c) => c.slug === p.category);
                const sub = cat?.subcategories.find((s) => s.slug === p.subcategory);
                return (
                  <tr key={p.id} className="hover:bg-cream-light/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-cream-dark border border-brown/10 overflow-hidden flex-shrink-0">
                        {p.image
                          ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-brown/20 text-[10px]">—</div>
                        }
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-brown">{p.name}</div>
                      {p.shortDescription && (
                        <div className="text-xs text-brown/50 mt-0.5 line-clamp-1">{p.shortDescription}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brown/70 hidden md:table-cell">{cat?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-brown/70 hidden lg:table-cell text-xs">{sub?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-center">
                      {p.published
                        ? <span className="inline-block bg-orange/10 text-orange text-[10px] tracking-widest px-2 py-0.5 font-semibold">ATIVO</span>
                        : <span className="inline-block bg-brown/10 text-brown/50 text-[10px] tracking-widest px-2 py-0.5 font-semibold">RASCUNHO</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/gestao/produtos/${p.id}`} className="p-1.5 text-brown/50 hover:text-orange border border-transparent hover:border-orange transition-colors" title="Editar">
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <form action={async () => { "use server"; await deleteProduct(p.id); }}>
                          <button type="submit" className="p-1.5 text-brown/50 hover:text-red-600 border border-transparent hover:border-red-200 transition-colors" title="Excluir">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
