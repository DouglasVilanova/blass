"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, ShieldCheck } from "lucide-react";
import { deleteProduct } from "@/app/gestao/(panel)/actions";
import { useConfirm } from "@/components/gestao/ConfirmDialog";

type Props = { productId: string; productName: string; category: string };

export default function AdminProductBar({ productId, productName, category }: Props) {
  const router = useRouter();
  const confirm = useConfirm();

  async function handleDelete() {
    const ok = await confirm({
      title: `Excluir "${productName}"?`,
      description: "O produto e todas as imagens do storage serão removidos.\n\nEsta ação não pode ser desfeita.",
      confirmLabel: "Excluir",
      tone: "danger",
    });
    if (!ok) return;
    await deleteProduct(productId);
    router.push(`/produtos?cat=${category}`);
  }

  return (
    <div className="bg-brown-dark border-b border-orange/30 px-6 py-2.5">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-orange">
          <ShieldCheck className="w-4 h-4" />
          <span className="tracking-widest font-semibold">MODO ADMIN</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/gestao/produtos/${productId}`}
            className="flex items-center gap-1.5 text-xs text-cream-light/80 hover:text-orange transition-colors border border-cream-light/20 hover:border-orange px-3 py-1.5"
          >
            <Pencil className="w-3 h-3" /> Editar produto
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-xs text-cream-light/80 hover:text-red-400 transition-colors border border-cream-light/20 hover:border-red-400 px-3 py-1.5"
          >
            <Trash2 className="w-3 h-3" /> Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
