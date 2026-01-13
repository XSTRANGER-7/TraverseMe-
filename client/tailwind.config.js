/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ], 
  theme: {
    extend: { 
      colors: {
        primary: "#FF6363",
        secondary: "#FFB800",
        dark: "#121212",
        lightDark: "#1E1E1E",
        lightDark2: "#0e0e0e",
      },
      borderWidth: {
        // 11: "5px",
        1: "1px",
        2: "2px",
        3: "3px",
        5: "5px",
        7: "7px",
        10: "10px",
        12: "12px",
      },
    },
  },
  
  plugins: [],
}