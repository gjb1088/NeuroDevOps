module.exports = {
  content: [ "./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./styles/**/*.css" ],
  theme: {
    extend: {
      colors: {
        'burn-bg':     '#0A0A0A',
        'burn-neon':   '#39FF14',
        'accent':      'var(--brand-accent)',  // your CSS var
      },
      boxShadow: {
        neon: '0 0 8px rgba(57,255,20,0.7)',
      }
    }
  },
  plugins: [ require('tailwindcss-textshadow') ]
}
