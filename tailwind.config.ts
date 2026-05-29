import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0f",
        panel: "#13131c",
        edge: "#23232f",
        accent: {
          DEFAULT: "#7c5cff",
          soft: "#9d86ff",
        },
        glow: "#5ce1ff",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(60% 60% at 50% 0%, rgba(124,92,255,0.25) 0%, rgba(10,10,15,0) 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
