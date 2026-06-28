import PageHeader from "@/components/gestao/PageHeader";
import { getSettings } from "@/lib/settings";
import { DEFAULT_STORE } from "@/lib/defaults";
import ConstruimosEditor from "./editor";

export const dynamic = "force-dynamic";

export default async function ConstruimosBlocoPage() {
  const settings = await getSettings();
  const layouts = settings.layouts ?? DEFAULT_STORE.settings.layouts;
  const texto = settings.construimos ?? DEFAULT_STORE.settings.construimos;

  return (
    <>
      <PageHeader
        title="Bloco — A Blass que construímos"
        subtitle="Edite o texto e posicione a mão e o brilho sobre o prédio."
      />
      <ConstruimosEditor initialLayouts={layouts} initialTexto={texto} />
    </>
  );
}
