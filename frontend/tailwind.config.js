/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Couleur primaire Indigo personnalisée
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          50: '#F0F4FF',
          500: '#4F46E5',
          600: '#4338CA',
        },
      },
      // Coins arrondis amplifiés
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      // Fond très clair pour la cohérence design
      backgroundColor: {
        'light': '#F3F4F6',
      },
    },
  },
  plugins: [],
}
