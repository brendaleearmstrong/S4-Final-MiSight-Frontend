/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FCD34D",    // amber-400
          dark: "#F59E0B",       // amber-500
          light: "#FDE68A",      // amber-300
        },
        background: "#151922",
        surface: "#1A1F2B",
      }
    },
  },
  plugins: [],
}