// See https://tailwindcss.com/docs/configuration for details
const remark = require('remark')
const fontSizeBase = 1.15;

module.exports = {
  purge: false,
  theme: {
    fontSize: {
      xs: (fontSizeBase * 0.75) + 'rem',
      sm: (fontSizeBase * 0.875) + 'rem',
      base: (fontSizeBase * 1) + 'rem',
      lg: (fontSizeBase * 1.125) + 'rem',
      xl: (fontSizeBase * 1.25) + 'rem',
      '2xl': (fontSizeBase * 1.5) + 'rem',
      '3xl': (fontSizeBase * 1.875) + 'rem',
      '4xl': (fontSizeBase * 2.25) + 'rem',
      '5xl': (fontSizeBase * 3) + 'rem',
      '6xl': (fontSizeBase * 4) + 'rem',
    }
  },
  variants: {},
  plugins: []
};
