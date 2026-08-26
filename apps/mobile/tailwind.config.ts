import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF3737",
          hover: "#e62e2e",
        },
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "Inter", "Segoe UI", "sans-serif"],
        body: ["Inter", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
