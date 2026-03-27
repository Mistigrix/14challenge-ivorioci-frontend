/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ci-orange': '#FF8C00',
        'ci-green': '#009E49',
        'dark-bg': '#0A0A0E',
        'surface': '#131318',
        'card': '#1A1A22',
        'border-ci': '#2A2A35',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}