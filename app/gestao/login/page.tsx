"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { signIn } from "./actions";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brown flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <img src="/brand/logo-negativo.webp" alt="Blass" width={180} height={52} />
          <div className="text-[10px] tracking-[0.4em] text-orange mt-3">GESTÃO</div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

function LoginForm() {
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/gestao";
  const [state, action] = useFormState(signIn, null);

  return (
    <form action={action} className="bg-brown-mid p-8 space-y-5">
      <input type="hidden" name="next" value={next} />

      <div>
        <label className="block text-[10px] tracking-widest text-cream-light/60 uppercase mb-1">E-mail</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full bg-brown-dark border border-brown-light/20 text-cream-light px-3 py-2.5 text-sm focus:outline-none focus:border-orange"
        />
      </div>

      <div>
        <label className="block text-[10px] tracking-widest text-cream-light/60 uppercase mb-1">Senha</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full bg-brown-dark border border-brown-light/20 text-cream-light px-3 py-2.5 text-sm focus:outline-none focus:border-orange"
        />
      </div>

      {state?.error && (
        <div className="text-red-400 text-xs bg-red-900/20 border border-red-500/30 px-3 py-2">
          {state.error}
        </div>
      )}

      <LoginButton />
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-orange text-white py-3 text-sm tracking-widest font-semibold uppercase hover:bg-orange-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {pending ? "Entrando…" : "Entrar"}
    </button>
  );
}
