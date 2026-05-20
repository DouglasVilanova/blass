import { notFound } from "next/navigation";
import { readStore } from "@/lib/store";
import { updateProduct } from "../../actions";
import ProductForm from "@/components/gestao/ProductForm";

export default async function EditarProduto({ params }: { params: { id: string } }) {
  const { products, categories } = await readStore();
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();

  async function action(formData: FormData) {
    "use server";
    await updateProduct(params.id, formData);
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Editar produto</h1>
      <p className="text-brown/70 mt-2">{product.name}</p>
      <div className="mt-8">
        <ProductForm action={action} categories={categories} initial={product} />
      </div>
    </div>
  );
}
