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
          emerald: "#1E5128",
          teal: "#1E6F6B",
          coral: "#FF6F61",
          clay: "#C27E6A",
          butter: "#F4E99B",
          bg: "#FFFFFF",
          text: "#191919",
          border: "rgba(0,0,0,0.06)"
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
