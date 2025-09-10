/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryGradientFrom: "#243447",
        primaryGradientTo: "#141d26",
        cardBg: "#2c3e50",
        borderColor: "#3a506b",
        accentFrom: "#ff5252",
        accentTo: "#ff7b46",
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
