/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}",
    "./public/views/*.html",
  ],
  theme: {
    extend: {
      width: {
        "26": "6.5rem",
        "33": "8.25rem",
        "34": "8.5rem",
      }
    },
  },
  plugins: [],
}

