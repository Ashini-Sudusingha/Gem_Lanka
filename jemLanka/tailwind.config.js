/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./**/*.html", "./**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        magical: ['Magical', 'sans-serif'],
        font1: ['FontOne', 'sans-serif'],
        font2: ['FontTwo', 'sans-serif'],
        font3: ['FontThree', 'sans-serif'],
        sans: [
          'Magical',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ]
      },
    },
  },
  plugins: [],
}
