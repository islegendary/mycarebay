/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': {
          'light': '#E0F2FE',
          'DEFAULT': '#0EA5E9',
          'dark': '#0369A1',
        },
        'brand-gray': {
          'light': '#F8FAFC',
          'medium': '#475569',
          'DEFAULT': '#334155',
          'dark': '#1E293B',
        }
      }
    },
  },
  plugins: [],
}
