/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cafe-brown': '#C67C4E',
        'pizza-red': '#FF5A36',
        'cream-light': '#F5EDE4',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'steam-rise': 'steam-rise 2s ease-out infinite',
        'pulse-offer': 'pulse-offer 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slow-zoom': 'slow-zoom 10s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'steam-rise': {
          '0%': { transform: 'translateY(10px) scale(0.9)', opacity: 0 },
          '50%': { opacity: 0.8 },
          '100%': { transform: 'translateY(-20px) scale(1.1)', opacity: 0 },
        },
        'pulse-offer': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: .8, transform: 'scale(1.05)' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        }
      }
    },
  },
  plugins: [],
}
