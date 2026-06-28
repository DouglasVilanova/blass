import PageHeader from "@/components/gestao/PageHeader";
import { getSettings } from "@/lib/settings";
import { DEFAULT_STORE } from "@/lib/defaults";
import CatalogoEditor from "./editor";

export const dynamic = "force-dynamic";

export default async function CatalogoBlocoPage() {
  const settings = await getSettings();
  const c = settings.catalogo ?? DEFAULT_STORE.settings.catalogo;

  return (
    <>
      <PageHeader
        title="Página de Produtos — Cabeçalho"
        subtitle="Textos do topo da página /produtos (catálogo)."
      />
      <CatalogoEditor initial={c} />
    </>
  );
}
