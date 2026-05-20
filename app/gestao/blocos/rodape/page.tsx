import PageHeader from "@/components/gestao/PageHeader";
import RodapeEditor from "./editor";
import { getSettings } from "@/lib/settings";

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Rodapé / Contato" subtitle="Telefone, endereço, e-mail e redes sociais (usado no header e no rodapé)." />
      <RodapeEditor initial={s.contact} />
    </>
  );
}
