/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF7',
          100: '#F9F4EB',
          200: '#F2E4CA',
          300: '#E8D1A3',
          400: '#DEBD7B',
          500: '#D4AF37', // Luxury Warm Gold
          600: '#B89428',
          700: '#94741C',
          800: '#735717',
          900: '#533D12',
          950: '#2F2107',
        },
        dark: {
          base: '#0A0D14',
          surface: '#121826',
          card: '#1A2234',
          border: '#2A364F',
          muted: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'card-glow': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
