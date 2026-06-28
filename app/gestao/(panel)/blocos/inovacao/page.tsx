import PageHeader from "@/components/gestao/PageHeader";
import { getSettings } from "@/lib/settings";
import { DEFAULT_STORE } from "@/lib/defaults";
import InovacaoEditor from "./editor";

export const dynamic = "force-dynamic";

export default async function InovacaoBlocoPage() {
  const settings = await getSettings();
  const inv = settings.inovacao ?? DEFAULT_STORE.settings.inovacao;

  return (
    <>
      <PageHeader
        title="Bloco — Inovação no setor moveleiro"
        subtitle="Texto à esquerda e galeria à direita."
      />
      <InovacaoEditor initial={inv} />
    </>
  );
}
