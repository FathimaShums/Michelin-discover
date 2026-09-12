/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        michelin: {
          red: '#D80027',
          darkRed: '#99001C',
          gold: '#D4AF37',
          amber: '#F59E0B',
          obsidian: '#0B0F19',
          charcoal: '#161B26',
          slate: '#1E2638',
          card: '#182030'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      }
    }
  },
  plugins: []
};
