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
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  
  plugins: [],
}