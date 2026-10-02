/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2E3440",
        soft: "#5B6577",
        line: "#E6E8EC",
        paper: "#F4F5F7",
        persian: "#1C39BB",
        "persian-deep": "#152E96",
        ok: "#2F9E6F",
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "Helvetica Neue", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 50px -24px rgba(46, 52, 64, 0.35)",
        lift: "0 28px 70px -28px rgba(28, 57, 187, 0.45)",
      },
    },
  },
  plugins: [],
  corePlugins: { preflight: true },
};
