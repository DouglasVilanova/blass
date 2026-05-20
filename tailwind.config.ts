import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F4E8C5",
          light: "#FBF4DC",
          dark: "#E8DAB0",
        },
        brown: {
          DEFAULT: "#3D2317",
          mid: "#5E3520",
          light: "#7A4A33",
          dark: "#2A1810",
        },
        orange: {
          DEFAULT: "#E87422",
          light: "#F08A3E",
          dark: "#C25D14",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-marcellus)", "Georgia", "serif"],
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
