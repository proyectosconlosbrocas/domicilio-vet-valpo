import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF3737",
          hover: "#e62e2e",
          // Rojo de marca oscurecido para fondos con texto blanco chico y
          // texto rojo sobre blanco (#FF3737 da 3.6:1, este 5.9:1).
          ink: "#c41e1e",
          soft: "#FFE2E2",
        },
        ink: "#2c3e50",
        // Verde WhatsApp con contraste suficiente para texto blanco.
        whatsapp: "#0f7a41",
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "Inter", "Segoe UI", "sans-serif"],
        body: ["Inter", "Segoe UI", "sans-serif"],
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
} satisfies Config;
