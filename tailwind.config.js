/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        app: "#f4f7f8",
        ink: "#172026",
        muted: "#63707a",
        line: "#dde4e8",
        surface: "#f8fbfc",
        hero: "#edf7f6",
        brand: {
          50: "#e7f3f1",
          100: "#cce7e3",
          200: "#9ed2ca",
          600: "#16756f",
          700: "#0f5e59",
          800: "#0b4b45",
          950: "#152126",
        },
        harvest: "#d9b95f",
      },
      boxShadow: {
        panel: "0 18px 40px rgba(15, 23, 42, 0.08)",
        soft: "0 12px 28px rgba(15, 23, 42, 0.06)",
        glow: "0 14px 34px rgba(217, 185, 95, 0.28)",
        glowStrong: "0 20px 50px rgba(22, 117, 111, 0.18)",
      },
      transitionDuration: {
        250: "250ms",
        300: "300ms",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
