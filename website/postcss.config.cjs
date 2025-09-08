// Only enable heavy PostCSS transforms in production to speed up dev
const postcssPresetEnv = require('postcss-preset-env')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  map: false,
  plugins: isProd
    ? [
        postcssPresetEnv({
          features: {
            'focus-visible-pseudo-class': false,
          },
        }),
      ]
    : [],
}


