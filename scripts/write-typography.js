import Typography from 'typography'
import fs from 'fs'
import gray from 'gray-percentage'
import { MOBILE_MEDIA_QUERY, TABLET_MEDIA_QUERY } from 'typography-breakpoint-constants'

const theme = {
  title: 'Plot.ly Academy',
  baseFontSize: '17px',
  baseLineHeight: '25.5px',
  googleFonts: [
    {
      name: 'Open Sans',
      styles: [
        '300',
        '400',
        '400i',
        '700',
      ],
    },
  ],
  headerFontFamily: ['Open Sans', 'sans-serif'],
  bodyFontFamily: ['Open Sans', 'sans-serif'],
  headerGray: 10,
  bodyGray: 20,
  headerWeight: 700,
  bodyWeight: 400,
  boldWeight: 700,
  overrideStyles: ({ adjustFontSizeTo, adjustFontSizeToMSValue, rhythm }, options) => ({
    a: {
      color: '#f92300',
      textDecoration: 'none',
    },
    'a:hover,a:active': {
      textDecoration: 'underline',
    },
    blockquote: {
      color: gray(41),
      fontStyle: 'italic',
      paddingLeft: rhythm(13/16),
      marginLeft: 0,
      borderLeft: `${rhythm(3/16)} solid ${gray(80)}`,
    },
    'blockquote > :last-child': {
      marginBottom: 0,
    },
    'blockquote cite': {
      color: gray(options.bodyGray),
      fontWeight: options.bodyWeight,
    },
    'blockquote cite:before': {
      content: '"— "',
    },
    ul: {
      listStyle: 'disc',
    },
    'ul,ol': {
      marginLeft: 0,
    },
    [MOBILE_MEDIA_QUERY]: {
      'ul,ol': {
        marginLeft: rhythm(1),
      },
      blockquote: {
        marginLeft: rhythm(-3/4),
        marginRight: 0,
        paddingLeft: rhythm(9/16),
      },
    },
    'h1,h2,h3,h4,h5,h6': {
      marginTop: rhythm(2),
    },
    // Use steeper curve for header sizes.
    // Polynomial created using mycurvefit.
    // y = 0.18 - 0.1228571*x + 0.05714286*x^2
    h1: {
      ...adjustFontSizeToMSValue(1),
      letterSpacing: '-2px',
    },
    h2: {
      ...adjustFontSizeToMSValue(.6028),
    },
    h3: {
      ...adjustFontSizeToMSValue(.3257),
    },
    h4: {
      ...adjustFontSizeToMSValue(.1628),
    },
    h5: {
      ...adjustFontSizeToMSValue(.1143),
    },
    h6: {
      ...adjustFontSizeToMSValue(0),
      fontStyle: 'italic',
    },
    '.post__title': {
      marginBottom: rhythm(1/2),
    },
    '.post__description': {
      ...adjustFontSizeToMSValue(1/5),
    },
  }),
}

const typography = new Typography(theme)

fs.writeFileSync('../_sass/base/_generated-typography.scss', typography.toString())
