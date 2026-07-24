/**
 * Injeta structured data (JSON-LD) no HTML.
 * Escapa "<" para evitar quebra do </script> — dados vêm do nosso banco,
 * mas a escapada garante robustez com qualquer texto de produto/post.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
