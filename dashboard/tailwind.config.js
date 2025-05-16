// dashboard/tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        'burn-bg': '#0A0A0A',
        'burn-neon': '#39FF14',
      },
      boxShadow: {
        neon: '0 0 8px rgba(57,255,20,0.7)',
      },
      textShadow: {
        neon: '0 0 4px rgba(57,255,20,0.9)',
      },
    }
  },
  plugins: [require('tailwindcss-textshadow')],
}
