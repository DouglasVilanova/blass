"use client";

import { useTransition } from "react";
import { useConfirm } from "./ConfirmDialog";

type Props = {
  /** Server action já vinculada (ex: deletePost.bind(null, id)) */
  action: () => Promise<void> | void;
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Botão de exclusão com dialog de confirmação branded.
 * Use no lugar de <form action={delete}> para garantir confirmação.
 */
export default function DeleteButton({ action, title, description, className, children }: Props) {
  const confirm = useConfirm();
  const [pending, start] = useTransition();

  async function onClick() {
    const ok = await confirm({
      title,
      description: description ?? "Esta ação não pode ser desfeita.",
      confirmLabel: "Excluir",
      tone: "danger",
    });
    if (!ok) return;
    start(() => { void action(); });
  }

  return (
    <button type="button" onClick={onClick} disabled={pending} className={className}>
      {children}
    </button>
  );
}
