const DEV = process.env.NODE_ENV !== 'production';

const cdnPath = 'HUBSPOT_PUBLIC_PATH_TO_FONTS_FOLDER';
const localPath = '/theme/custom/assets/fonts';

// on production change local path to hubspot public.
const fontsPath = DEV ? localPath : cdnPath;

const autoPrefixer = require('autoprefixer');
const postcssFontMagician = require('postcss-font-magician');
const cssNano = require('cssnano');

const plugins = [
  autoPrefixer,
  postcssFontMagician({
    custom: {
      'icon-font': {
        variants: {
          normal: {
            400: {
              url: {
                woff: `${fontsPath}/icon-font.woff`,
              },
            },
          },
        },
      },
    },
    variants: {
      Montserrat: {
        400: ['woff2', 'woff'],
        800: ['woff2', 'woff'],
      },
    },
    display: 'swap',
    foundries: ['custom', 'google'],
  }),
];

// Use only for production build
if (!DEV) {
  plugins.push(cssNano);
}

module.exports = { plugins };
