import { notFound } from "next/navigation";
import PageHeader from "@/components/gestao/PageHeader";
import ProductForm from "@/components/gestao/ProductForm";
import { getCategories, getProducts } from "@/lib/db";
import { updateProduct } from "@/app/gestao/actions";

export default async function EditarProduto({ params }: { params: { id: string } }) {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();

  async function action(fd: FormData) {
    "use server";
    await updateProduct(params.id, fd);
  }

  return (
    <>
      <PageHeader title="Editar produto" subtitle={product.name} />
      <ProductForm action={action} categories={categories} initial={product} />
    </>
  );
}
