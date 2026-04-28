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
          bg: "#0a0a0a",
          card: "#141414",
          card2: "#1a1a1a",
          border: "rgba(255,255,255,0.07)"
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
