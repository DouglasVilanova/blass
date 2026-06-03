"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="font-display text-[120px] leading-none text-brown/10 select-none">500</div>
        <h1 className="font-display text-3xl text-brown -mt-4">Algo deu errado</h1>
        <p className="text-brown/60 mt-3">Ocorreu um erro inesperado. Tente novamente ou volte ao início.</p>
        {error.digest && (
          <p className="text-[11px] text-brown/30 mt-2 font-mono">ID: {error.digest}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button onClick={reset} className="btn-orange">Tentar novamente</button>
          <Link href="/" className="btn-outline">Voltar ao início</Link>
        </div>
      </div>
    </div>
  );
}
