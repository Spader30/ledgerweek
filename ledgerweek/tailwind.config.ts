import type { Config } from "tailwindcss";
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif","system-ui","Inter","Segoe UI","Roboto","Helvetica Neue","Arial","Noto Sans","Apple Color Emoji","Segoe UI Emoji"],
      },
      boxShadow: { soft: "0 10px 30px rgba(0,0,0,0.35)" }
    },
  },
  plugins: [],
} satisfies Config;
