// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\frontend\tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          50: "var(--navy-50)",
          100: "var(--navy-100)",
          200: "var(--navy-200)",
          300: "var(--navy-300)",
          DEFAULT: "#0B1426",
          dark: "#060D1A",
        },
        gold: {
          light: "var(--gold-light)",
          DEFAULT: "var(--gold-DEFAULT)",
          dark: "var(--gold-dark)",
        },
        cream: "var(--offwhite-DEFAULT)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
