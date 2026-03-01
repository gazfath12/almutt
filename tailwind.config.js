/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#050505',
        'bg-darker': '#020202',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0b0',
        'neon-blue': '#00f3ff',
        'neon-purple': '#bc13fe',
        'neon-pink': '#ff007f',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
