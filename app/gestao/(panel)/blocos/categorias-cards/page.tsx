import PageHeader from "@/components/gestao/PageHeader";
import { getSettings } from "@/lib/settings";
import { DEFAULT_STORE } from "@/lib/defaults";
import CategoriasCardsEditor from "./editor";

export const dynamic = "force-dynamic";

export default async function CategoriasCardsBlocoPage() {
  const settings = await getSettings();
  const cards = settings.categoriasCards?.cards ?? DEFAULT_STORE.settings.categoriasCards.cards;

  return (
    <>
      <PageHeader
        title="Bloco — Cards de categoria (aceso/apagado)"
        subtitle="Cada card tem nome, link, imagem apagada (padrão) e acesa (no hover). Empilham em zigzag."
      />
      <CategoriasCardsEditor initialCards={cards} />
    </>
  );
}
