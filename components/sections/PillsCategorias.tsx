import { DEFAULT_STORE } from "@/lib/defaults";

export default function PillsCategorias({ words }: { words?: string[] }) {
  const list = words?.length ? words : DEFAULT_STORE.settings.pills.words;
  // Lista duplicada → loop contínuo
  const loop = [...list, ...list];

  return (
    <section className="bg-[#FE7824] py-4 md:py-5 overflow-hidden">
      <div className="overflow-hidden">
        <div className="flex gap-3 w-max animate-marquee-reverse">
          {loop.map((w, i) => (
            <span
              key={i}
              className="whitespace-nowrap border border-white/80 rounded-full px-5 py-1.5 text-white text-xs md:text-sm tracking-wider font-medium"
            >
              {w}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
