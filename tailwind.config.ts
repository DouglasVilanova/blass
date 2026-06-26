import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cores oficiais da marca Blass (extraídas do Manual de Marca)
        cream: {
          DEFAULT: "#FFFADD",
          light: "#FFFCEC",
          dark: "#F2EBC4",
        },
        brown: {
          DEFAULT: "#4F2612",
          mid: "#6B3520",
          light: "#8A4A33",
          dark: "#3A1B0C",
        },
        orange: {
          DEFAULT: "#F0781A",
          light: "#F58E3D",
          dark: "#C95F12",
        },
        // Tons escuros cinematográficos do novo site (mockup)
        night: {
          DEFAULT: "#1F1108", // fundo padrão escuro
          deep: "#150B05",    // quase preto (rodapé/hero)
          soft: "#2C190D",    // marrom escuro de cards
          line: "#3A2415",    // bordas sutis
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-marcellus)", "Georgia", "serif"],
        brand: ["var(--font-punoer)", "var(--font-marcellus)", "Georgia", "serif"],
        exo: ["var(--font-exo2)", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "reveal-fade": { from: { opacity: "0" }, to: { opacity: "1" } },
        "reveal-up": {
          from: { opacity: "0", transform: "translateY(34px)" },
          to: { opacity: "1", transform: "none" },
        },
        "reveal-left": {
          from: { opacity: "0", transform: "translateX(-46px)" },
          to: { opacity: "1", transform: "none" },
        },
        "reveal-right": {
          from: { opacity: "0", transform: "translateX(46px)" },
          to: { opacity: "1", transform: "none" },
        },
        "reveal-left-far": {
          from: { opacity: "0", transform: "translateX(-160px)" },
          to: { opacity: "1", transform: "none" },
        },
        "reveal-up-far": {
          from: { opacity: "0", transform: "translateY(110px)" },
          to: { opacity: "1", transform: "none" },
        },
        "reveal-right-far": {
          from: { opacity: "0", transform: "translateX(160px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "marquee-reverse": "marquee 50s linear infinite reverse",
        "reveal-fade": "reveal-fade 1.2s ease-out both",
        "reveal-up": "reveal-up 1.2s ease-out both",
        "reveal-left": "reveal-left 1.2s ease-out both",
        "reveal-right": "reveal-right 1.2s ease-out both",
        "reveal-left-far": "reveal-left-far 1.3s ease-out both",
        "reveal-up-far": "reveal-up-far 1.3s ease-out both",
        "reveal-right-far": "reveal-right-far 1.3s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
