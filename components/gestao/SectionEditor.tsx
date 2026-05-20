"use client";

import { ReactNode, useState, useTransition } from "react";
import { useToast } from "./Toast";

export default function SectionEditor<T>({
  initial,
  save,
  children,
}: {
  initial: T;
  save: (data: T) => Promise<{ ok?: boolean; error?: string }>;
  children: (state: T, set: (patch: Partial<T>) => void) => ReactNode;
}) {
  const [state, setState] = useState<T>(initial);
  const [pending, start] = useTransition();
  const { push } = useToast();

  const set = (patch: Partial<T>) => setState((s) => ({ ...s, ...patch }));

  const onSave = () => {
    start(async () => {
      const res = await save(state);
      if (res?.error) push(res.error, "error");
      else push("Salvo com sucesso");
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white border border-brown/10 p-6 space-y-5">
        {children(state, set)}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onSave} disabled={pending} className="btn-orange disabled:opacity-50">
          {pending ? "Salvando…" : "Salvar"}
        </button>
        {pending && <span className="text-xs text-brown/50">aguarde…</span>}
      </div>
    </div>
  );
}
