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
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-marcellus)", "Georgia", "serif"],
        brand: ["var(--font-punoer)", "var(--font-marcellus)", "Georgia", "serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
