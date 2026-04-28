/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          green: "#22c55e",
          "green-dim": "#16a34a",
          "green-glow": "rgba(34,197,94,0.25)",
          yellow: "#facc15",
          bg: "#f8faf7",
          card: "#ffffff",
          card2: "#f3f6f2",
          border: "rgba(0,0,0,0.05)"
        }
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['DM Sans', 'sans-serif']
      }
    },
  },
  plugins: [],
}
