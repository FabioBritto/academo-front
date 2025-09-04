/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'academo': {
          'sage': 'rgb(168, 187, 163)',      // Verde sábio
          'cream': 'rgb(247, 244, 234)',     // Creme
          'peach': 'rgb(235, 217, 209)',     // Pêssego
          'brown': 'rgb(184, 124, 76)',      // Marrom
        }
      }
    },
  },
  plugins: [],
}

