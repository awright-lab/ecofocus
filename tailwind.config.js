// tailwind.config.js
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Optional brand extensions (safe to remove if you don’t want them here)
      colors: {
        emerald: {
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
        },
        tealbrand: { 600: '#00767a', 700: '#0b666a' },
        marigold: { 400: '#FFC107', 500: '#dd9e37' },
      },
      borderRadius: {
        '2xl': '1rem',
      },
      boxShadow: {
        soft: '0 10px 20px -10px rgba(0,0,0,.15)',
      },
    },
  },
  plugins: [typography],
}

export default config





