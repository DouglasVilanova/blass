"use client";

import { useState } from "react";
import SectionEditor from "@/components/gestao/SectionEditor";
import { Field, inputCls } from "@/components/gestao/Field";
import GalleryUpload from "@/components/gestao/GalleryUpload";
import { saveSection } from "@/app/gestao/(panel)/settings-actions";
import type { SiteSettings } from "@/lib/types";

export default function HeroEditor({ initial }: { initial: SiteSettings["hero"] }) {
  return (
    <SectionEditor<SiteSettings["hero"]>
      initial={{
        ...initial,
        // Migra legado: se não tem banners[], usa image como primeiro banner
        banners:
          initial.banners && initial.banners.length > 0
            ? initial.banners
            : initial.image
            ? [initial.image]
            : [],
      }}
      save={async (v) => {
        // Mantém compat com hero.image (1º banner = imagem principal)
        const next = { ...v, image: v.banners?.[0] ?? "" };
        return saveSection("hero", next);
      }}
    >
      {(s, set) => (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Título">
              <input className={inputCls} value={s.title} onChange={(e) => set({ title: e.target.value })} />
            </Field>
            <Field label="Subtítulo">
              <input className={inputCls} value={s.subtitle} onChange={(e) => set({ subtitle: e.target.value })} />
            </Field>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="text-xs tracking-widest text-brown/70 font-semibold uppercase">
                Banners do Hero
              </div>
              <div className="text-[11px] text-brown/50">
                <span className="text-brown/40">recomendado:</span> 1920 × 1080 px (paisagem 16:9)
              </div>
            </div>
            <p className="text-[11px] text-brown/50 mb-3">
              Adicione 1 ou mais banners. Com 2+, vira carrossel automático com rotação de 6s,
              barra de progresso e setas. A <strong>primeira posição</strong> é o banner inicial
              exibido ao abrir o site.
            </p>
            <GalleryUpload
              value={s.banners ?? []}
              onChange={(banners) => set({ banners })}
              folder="site"
            />
          </div>
        </div>
      )}
    </SectionEditor>
  );
}
