/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'fulfulde': ['Lucida Fulfulde', 'serif'],
      },
    },
  },
  plugins: [],
}