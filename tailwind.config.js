const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './public/*.html',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.js',
    './app/views/**/*.{erb,haml,html,slim}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        pink: {
          ...defaultTheme.colors.pink,
          150: '#fce7f3', // Custom pink-150 between pink-100 and pink-200
        }
      }
    },
  },
  plugins: []
}
