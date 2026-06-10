import { getCategories, getProducts } from "@/lib/db";
import PageHeader from "@/components/gestao/PageHeader";
import CategoriasManager from "./CategoriasManager";

export default async function CategoriasAdmin() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(false), // include drafts to count accurately
  ]);

  // Count products per category slug
  const productCounts: Record<string, number> = {};
  for (const p of products) {
    if (!p.category) continue;
    productCounts[p.category] = (productCounts[p.category] ?? 0) + 1;
  }

  return (
    <>
      <PageHeader
        title="Categorias"
        subtitle="Gerencie categorias e subcategorias de produtos."
      />
      <CategoriasManager categories={categories} productCounts={productCounts} />
    </>
  );
}
