import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Reebok — nunca usar hex directamente en componentes, siempre estos tokens
        "rb-red": "#CC0000",
        "rb-blue": "#003DA5",
        "rb-white": "#F5F4F0",
        "rb-black": "#0D0D0D",
        "rb-900": "#1A1A1A",
        "rb-800": "#2A2A2A",
        "rb-700": "#3D3D3D",
        "rb-500": "#737373",
        "rb-gold": "#C9A84C",
        "rb-silver": "#A0A0A0",
        "rb-bronze": "#8B5E3C",
      },
      fontFamily: {
        display: ["var(--font-barlow-condensed)", "system-ui", "sans-serif"],
        body: ["var(--font-barlow)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        hero: ["4.5rem", { lineHeight: "1", fontWeight: "900" }],
        h1: ["3rem", { lineHeight: "1.05", fontWeight: "800" }],
        h2: ["2rem", { lineHeight: "1.1", fontWeight: "700" }],
        h3: ["1.375rem", { lineHeight: "1.2", fontWeight: "700" }],
        label: [
          "0.6875rem",
          { lineHeight: "1", fontWeight: "700", letterSpacing: "0.15em" },
        ],
        body: ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        small: ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],
      },
      borderRadius: {
        rb: "8px",
        "rb-lg": "12px",
      },
      backgroundImage: {
        "card-gradient":
          "linear-gradient(to right, var(--tw-gradient-stops))",
        "rb-gradient": "linear-gradient(135deg, #CC0000 0%, #003DA5 100%)",
      },
      animation: {
        "pulse-live": "pulse-live 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
      },
      keyframes: {
        "pulse-live": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "slide-up": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 32px rgba(0, 0, 0, 0.6)",
        "rb-red": "0 0 20px rgba(204, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
