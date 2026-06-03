"use client";

import { useFormState, useFormStatus } from "react-dom";
import PageHeader from "@/components/gestao/PageHeader";
import { changePassword } from "./actions";
import { inputCls } from "@/components/gestao/Field";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function SecurityPage() {
  const [state, action] = useFormState(changePassword, null);

  return (
    <>
      <PageHeader title="Segurança" subtitle="Altere a senha de acesso ao painel." />
      <form action={action} className="max-w-md bg-white border border-brown/10 p-6 space-y-5">
        <div>
          <label className="block text-xs tracking-widest text-brown/70 font-semibold uppercase mb-1">Nova senha</label>
          <input name="newPassword" type="password" required className={inputCls} autoComplete="new-password" />
          <p className="text-[11px] text-brown/40 mt-1">Mín. 10 caracteres, maiúscula, minúscula e número.</p>
        </div>
        <div>
          <label className="block text-xs tracking-widest text-brown/70 font-semibold uppercase mb-1">Confirmar senha</label>
          <input name="confirm" type="password" required className={inputCls} autoComplete="new-password" />
        </div>

        {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
        {state?.ok && (
          <div className="flex items-center gap-2 text-orange text-sm">
            <CheckCircle2 className="w-4 h-4" /> Senha alterada com sucesso.
          </div>
        )}

        <SubmitButton />
      </form>
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-orange flex items-center gap-2 disabled:opacity-50">
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {pending ? "Salvando…" : "Alterar senha"}
    </button>
  );
}
