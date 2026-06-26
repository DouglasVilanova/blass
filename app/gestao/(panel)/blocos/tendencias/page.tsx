import PageHeader from "@/components/gestao/PageHeader";
import { getSettings } from "@/lib/settings";
import { DEFAULT_STORE } from "@/lib/defaults";
import TendenciasEditor from "./editor";

export const dynamic = "force-dynamic";

export default async function TendenciasBlocoPage() {
  const settings = await getSettings();
  const t = settings.tendencias ?? DEFAULT_STORE.settings.tendencias;

  return (
    <>
      <PageHeader
        title="Bloco — Faixa de tendências"
        subtitle="Frase sobre a foto de fundo. Use **texto** para deixar em negrito."
      />
      <TendenciasEditor initial={t} />
    </>
  );
}
