/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f97316", // warm YC-style orange
          light: "#fb923c",
          dark: "#c2410c",

          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },

        background: "#faf7f2", // cozy warm off-white
        foreground: "#2a211c", // soft dark brown
        muted: "#f3eadf", // warm muted background
        "muted-foreground": "#7a6a5f",

        border: "#e7d8c9",
        destructive: "#dc2626",

        card: "#ffffff",
        "card-foreground": "#2a211c",

        accent: {
          DEFAULT: "#8b5e34", // Claude-like warm brown
          light: "#b08968",
          dark: "#5c4033",
        },

        cream: {
          50: "#fffaf3",
          100: "#fbf7f0",
          200: "#f3eadf",
          300: "#ead9c9",
        },

        brown: {
          50: "#f7f1eb",
          100: "#ead9c9",
          200: "#d6bfa9",
          300: "#b08968",
          400: "#8b5e34",
          500: "#6f4e37",
          600: "#5c4033",
          700: "#3f2f28",
          800: "#2a211c",
          900: "#1c1713",
        },
      },

      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: ["Lora", "Georgia", "serif"],
      },
      
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },

      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },

      boxShadow: {
        soft: "0 10px 30px rgba(42, 33, 28, 0.08)",
        cozy: "0 8px 24px rgba(139, 94, 52, 0.12)",
      },

      borderRadius: {
        cozy: "1.25rem",
      },
    },
  },
  plugins: [],
};
