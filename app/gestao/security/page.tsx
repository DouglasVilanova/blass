import PageHeader from "@/components/gestao/PageHeader";
import { Shield, Info } from "lucide-react";

export default function SecurityPage() {
  return (
    <>
      <PageHeader title="Segurança" subtitle="Informações de acesso ao painel." />
      <div className="max-w-lg space-y-4">
        <div className="bg-white border border-brown/10 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-orange mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold text-brown">Credenciais via variável de ambiente</div>
              <p className="text-sm text-brown/70 mt-1">
                E-mail e senha de acesso são definidos pelas variáveis <code className="bg-cream-dark px-1 text-xs">ADMIN_EMAIL</code> e{" "}
                <code className="bg-cream-dark px-1 text-xs">ADMIN_PASSWORD</code> no arquivo <code className="bg-cream-dark px-1 text-xs">.env.local</code> (desenvolvimento) ou nas configurações do Vercel (produção).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2 border-t border-brown/10">
            <Info className="w-5 h-5 text-brown/40 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-brown/60 space-y-1">
              <p>Para alterar a senha:</p>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>Atualize <code className="bg-cream-dark px-1 text-xs">ADMIN_PASSWORD</code> no Vercel → Settings → Environment Variables</li>
                <li>Faça um redeploy ou aguarde o próximo deploy</li>
              </ol>
              <p className="pt-1">
                Requisitos: mín. 10 caracteres, maiúscula, minúscula e número.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange/10 border border-orange/30 p-4 text-sm text-brown">
          <strong>Sessão:</strong> Token HMAC-SHA256 assinado com <code className="bg-cream-dark px-1 text-xs">SESSION_SECRET</code>, válido por 7 dias. Cookie httpOnly + secure em produção.
        </div>
      </div>
    </>
  );
}
