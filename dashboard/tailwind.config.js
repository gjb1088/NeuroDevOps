// dashboard/tailwind.config.js
module.exports = {
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './styles/**/*.css'],
  theme: {
    extend: {
      dropShadow: {
        neon: '0 0 8px rgba(255,0,255,0.7)',
      }
    }
  },
  plugins: []
}
