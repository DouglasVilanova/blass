import PageHeader from "@/components/gestao/PageHeader";
import ProductForm from "@/components/gestao/ProductForm";
import { getCategories, countFeaturedProducts } from "@/lib/db";
import { createProduct } from "@/app/gestao/(panel)/actions";

export default async function NovoProduto() {
  const [categories, featuredCount] = await Promise.all([
    getCategories(),
    countFeaturedProducts(),
  ]);
  return (
    <>
      <PageHeader title="Novo produto" subtitle="Preencha os dados e salve. Imagem otimizada automaticamente." />
      <ProductForm action={createProduct} categories={categories} featuredCount={featuredCount} />
    </>
  );
}
