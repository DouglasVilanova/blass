"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Send, CheckCircle2 } from "lucide-react";
import { subscribeNewsletter } from "@/app/(site)/newsletter-actions";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Assinar novidades"
      className="rounded-full bg-orange hover:bg-orange-dark text-white px-4 py-2.5 text-xs font-semibold tracking-wide transition-colors disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
    >
      <Send className="w-3.5 h-3.5" /> {pending ? "Enviando…" : "Assinar"}
    </button>
  );
}

export default function NewsletterForm() {
  const [state, action] = useFormState(subscribeNewsletter, null);

  if (state?.ok) {
    return (
      <div className="flex items-center gap-2 text-sm text-orange">
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        E-mail cadastrado! Você receberá nossas novidades.
      </div>
    );
  }

  return (
    <form action={action} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="seu@email.com.br"
          className="flex-1 min-w-0 rounded-full border border-cream-light/20 bg-white/5 px-4 py-2.5 text-sm focus:outline-none focus:border-orange placeholder:text-cream-light/30"
          style={{ color: "#FFFCEC" }}
        />
        <SubmitBtn />
      </div>
      {state?.error && <div className="text-xs text-red-400">{state.error}</div>}
    </form>
  );
}
