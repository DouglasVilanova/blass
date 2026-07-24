import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Blass — Iluminação & Componentes",
    short_name: "Blass",
    description:
      "Há mais de duas décadas desenvolvendo soluções em iluminação e componentes para móveis.",
    start_url: "/",
    display: "standalone",
    background_color: "#1F1108",
    theme_color: "#1F1108",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
