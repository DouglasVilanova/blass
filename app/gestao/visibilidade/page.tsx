import PageHeader from "@/components/gestao/PageHeader";
import VisibilidadeEditor from "./editor";
import { getSettings } from "@/lib/settings";

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Visibilidade" subtitle="Liga/desliga blocos da página inicial. Blocos ocultos também somem do menu lateral." />
      <VisibilidadeEditor initial={s.visibility} />
    </>
  );
}
