import { readStore } from "@/lib/store";
import { createProduct } from "../../actions";
import ProductForm from "@/components/gestao/ProductForm";

export default async function NovoProduto() {
  const { categories } = await readStore();
  return (
    <div>
      <h1 className="font-display text-3xl">Novo produto</h1>
      <p className="text-brown/70 mt-2">Preencha os campos abaixo.</p>
      <div className="mt-8">
        <ProductForm action={createProduct} categories={categories} />
      </div>
    </div>
  );
}
