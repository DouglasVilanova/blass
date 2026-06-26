export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-8">
      <h1 className="font-exo font-bold text-3xl text-brown">{title}</h1>
      {subtitle && <p className="text-brown/70 mt-1">{subtitle}</p>}
    </header>
  );
}
