/* global process __dirname */
const DEV = process.env.NODE_ENV !== 'production';

const autoPrefixer = require('autoprefixer');
const cssMqpacker = require('css-mqpacker');
const postcssFontMagician = require('postcss-font-magician');
const cssNano = require('cssnano');

const plugins = [
  autoPrefixer,
  postcssFontMagician({
    google: {
      variants: {
        'IBM Plex Sans': {},
      },
    },
    foundries: ['custom', 'google'],
  }),
  cssMqpacker,
];

// Use only for production build
if (!DEV) {
  plugins.push(cssNano);
}

module.exports = { plugins };
