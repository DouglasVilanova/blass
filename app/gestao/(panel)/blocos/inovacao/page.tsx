import PageHeader from "@/components/gestao/PageHeader";
import { getSettings } from "@/lib/settings";
import { DEFAULT_STORE } from "@/lib/defaults";
import InovacaoEditor from "./editor";

export const dynamic = "force-dynamic";

export default async function InovacaoBlocoPage() {
  const settings = await getSettings();
  const images = settings.inovacao?.images ?? DEFAULT_STORE.settings.inovacao.images;

  return (
    <>
      <PageHeader
        title="Bloco — Inovação no setor moveleiro"
        subtitle="Galeria de imagens exibida à direita do texto. A primeira é a que abre; use as setas no site para navegar."
      />
      <InovacaoEditor initialImages={images} />
    </>
  );
}
