import Link from "next/link";
import { Plus } from "lucide-react";
import { getCategories, getProducts } from "@/lib/db";
import PageHeader from "@/components/gestao/PageHeader";
import ProductsTable from "./ProductsTable";

export default async function ProdutosAdmin() {
  const [products, categories] = await Promise.all([
    getProducts(false), // include drafts
    getCategories(),
  ]);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <PageHeader
          title="Produtos"
          subtitle={`${products.length} produto${products.length !== 1 ? "s" : ""} cadastrado${products.length !== 1 ? "s" : ""}`}
        />
        <Link href="/gestao/produtos/novo" className="btn-orange flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo produto
        </Link>
      </div>

      <ProductsTable products={products} categories={categories} />
    </>
  );
}
