import type { Config } from "tailwindcss";

export const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0d1117",
        panel: "#121821",
        panelSoft: "#192130",
        line: "#293244",
        kamas: "#d8b957",
        mint: "#62d6a3",
        coral: "#ff7a7a"
      },
      boxShadow: {
        soft: "0 1rem 2.5rem rgb(0 0 0 / 0.22)"
      }
    }
  },
  plugins: []
} satisfies Config;

export default config;
