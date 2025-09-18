/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:  "#FDF6E3",
          bg2: "#FAF3DD",
          navy:"#0B1D3A",
          red: "#D21E2B",
          redDark: "#A0151F",
          redSoft: "#FBE9EB",
          gold:"#F2B300",
          text:"#1E1E1E"
        }
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      boxShadow: { card: "0 10px 22px rgba(0,0,0,0.06)" },
      keyframes: {
        scroll: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } }
      },
      animation: { scroll: "scroll 40s linear infinite" }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
