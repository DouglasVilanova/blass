import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="font-display text-[120px] leading-none text-brown/10 select-none">404</div>
        <h1 className="font-display text-3xl text-brown -mt-4">Página não encontrada</h1>
        <p className="text-brown/60 mt-3">O endereço que você acessou não existe ou foi removido.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link href="/" className="btn-orange">Voltar para o início</Link>
          <Link href="/produtos" className="btn-outline">Ver produtos</Link>
        </div>
      </div>
    </div>
  );
}
