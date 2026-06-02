import PageHeader from "@/components/gestao/PageHeader";
import ProductForm from "@/components/gestao/ProductForm";
import { getCategories } from "@/lib/db";
import { createProduct } from "@/app/gestao/actions";

export default async function NovoProduto() {
  const categories = await getCategories();
  return (
    <>
      <PageHeader title="Novo produto" subtitle="Preencha os dados e salve. Imagem otimizada automaticamente." />
      <ProductForm action={createProduct} categories={categories} />
    </>
  );
}
