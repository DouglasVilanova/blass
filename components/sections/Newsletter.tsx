"use client";

import { useFormState, useFormStatus } from "react-dom";
import { CheckCircle2 } from "lucide-react";
import { subscribeNewsletter } from "@/app/(site)/newsletter-actions";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-orange hover:bg-orange-dark text-white px-6 py-3 text-sm font-semibold tracking-wide transition-colors disabled:opacity-50 whitespace-nowrap"
    >
      {pending ? "Enviando…" : "Quero me cadastrar"}
    </button>
  );
}

export default function Newsletter() {
  const [state, action] = useFormState(subscribeNewsletter, null);

  return (
    <section className="bg-gradient-to-b from-brown to-[#3C1C0E] border-t border-orange/20">
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-12">
        <h2 className="font-exo font-semibold text-cream-light text-xl md:text-2xl">
          Inscreva-se na nossa newsletter!
        </h2>

        {state?.ok ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-orange">
            <CheckCircle2 className="w-5 h-5" /> Cadastro feito! Você receberá nossas novidades.
          </div>
        ) : (
          <form action={action} className="mt-5 space-y-3">
            {/* Faixa flat: campos inline */}
            <div className="flex flex-col md:flex-row gap-3">
              <input
                name="name"
                type="text"
                placeholder="Digite seu nome"
                className="flex-1 min-w-0 bg-transparent border-b border-cream-light/25 px-1 py-2.5 text-sm focus:outline-none focus:border-orange placeholder:text-cream-light/35"
                style={{ color: "#FFFCEC" }}
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Digite seu e-mail"
                className="flex-1 min-w-0 bg-transparent border-b border-cream-light/25 px-1 py-2.5 text-sm focus:outline-none focus:border-orange placeholder:text-cream-light/35"
                style={{ color: "#FFFCEC" }}
              />
              <SubmitBtn />
            </div>

            <label className="flex items-start gap-2 text-[11px] text-cream-light/50">
              <input type="checkbox" required className="mt-0.5 w-3.5 h-3.5 accent-orange" />
              <span>Autorizo a Blass a enviar novidades e conteúdos para o e-mail informado.</span>
            </label>

            {state?.error && <div className="text-xs text-red-400">{state.error}</div>}
          </form>
        )}
      </div>
    </section>
  );
}
