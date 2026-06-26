import PageHeader from "@/components/gestao/PageHeader";
import { getSettings } from "@/lib/settings";
import { DEFAULT_STORE } from "@/lib/defaults";
import GaleriaEditor from "./editor";

export const dynamic = "force-dynamic";

export default async function GaleriaBlocoPage() {
  const settings = await getSettings();
  const images = settings.galeria?.images ?? DEFAULT_STORE.settings.galeria.images;

  return (
    <>
      <PageHeader
        title="Bloco — Galeria (duas décadas)"
        subtitle="Fotos que rolam automaticamente na esteira. Adicione, remova ou reordene."
      />
      <GaleriaEditor initialImages={images} />
    </>
  );
}
