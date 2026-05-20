import PageHeader from "@/components/gestao/PageHeader";
import MenuEditor from "./editor";
import { getSettings } from "@/lib/settings";

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Menu / Logo" subtitle="Telefone do header e redes sociais. Logo BLASS é texto + ícone (editável no código)." />
      <MenuEditor initial={s.contact} />
    </>
  );
}
