import { notFound } from "next/navigation";
import PageHeader from "@/components/gestao/PageHeader";
import ProductForm from "@/components/gestao/ProductForm";
import { getCategories, getProducts, countFeaturedProducts } from "@/lib/db";
import { updateProduct } from "@/app/gestao/(panel)/actions";

export default async function EditarProduto({ params }: { params: { id: string } }) {
  const [products, categories, featuredCount] = await Promise.all([
    getProducts(),
    getCategories(),
    countFeaturedProducts(params.id), // exclude self
  ]);
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();

  async function action(fd: FormData) {
    "use server";
    await updateProduct(params.id, fd);
  }

  return (
    <>
      <PageHeader title="Editar produto" subtitle={product.name} />
      <ProductForm
        action={action}
        categories={categories}
        initial={product}
        featuredCount={featuredCount}
      />
    </>
  );
}
