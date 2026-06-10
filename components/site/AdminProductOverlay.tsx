"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/gestao/(panel)/actions";
import { useConfirm } from "@/components/gestao/ConfirmDialog";

type Props = { productId: string; productName: string };

export default function AdminProductOverlay({ productId, productName }: Props) {
  const confirm = useConfirm();

  async function handleDelete() {
    const ok = await confirm({
      title: `Excluir "${productName}"?`,
      description: "O produto e todas as imagens vinculadas serão removidos.\n\nEsta ação não pode ser desfeita.",
      confirmLabel: "Excluir",
      tone: "danger",
    });
    if (!ok) return;
    await deleteProduct(productId);
  }

  return (
    <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      <Link
        href={`/gestao/produtos/${productId}`}
        onClick={(e) => e.stopPropagation()}
        className="bg-white/90 hover:bg-orange hover:text-white text-brown p-1.5 shadow transition-colors"
        title="Editar"
      >
        <Pencil className="w-3.5 h-3.5" />
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(); }}
        className="bg-white/90 hover:bg-red-600 hover:text-white text-brown p-1.5 shadow transition-colors"
        title="Excluir"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
