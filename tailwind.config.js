/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    // Avatar background colors
    'bg-blue-600',
    'bg-emerald-600', 
    'bg-violet-600',
    'bg-red-600',
    'bg-orange-600',
    'bg-cyan-600',
    'bg-lime-600',
    'bg-fuchsia-600',
    'bg-indigo-600',
    'bg-rose-600',
    'bg-teal-600',
    'bg-amber-700'
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
