/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          50: '#f9f9f9',
          100: '#f2f2f2',
          200: '#e6e6e6',
          300: '#d9d9d9',
          400: '#cccccc',
          500: '#bfbfbf',
          600: '#a6a6a6',
          700: '#8c8c8c',
          800: '#737373',
          900: '#1a1a1a', // Near black for luxury
          950: '#0d0d0d',
        }
      }
    },
  },
  plugins: [],
}
