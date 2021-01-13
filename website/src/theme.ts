import { css } from "linaria"
import Color from "color"
import Typography from "typography"

const theme = {
  fonts: {
    // 4 fonts total: header + sans body, serif body, serif smallcaps, Cherokee.
    // Noto Serif supports glottal stops and more accents than other fonts.
    bodyArr: ["Spectral", "Digohweli", "serif", "Arial"],
    headerArr: ["Quattrocento Sans", "Segoe UI", "Arial", "sans-serif"],
    cherokee: `"Digohweli", "Spectral", "serif", "Arial"`,
    smallCaps: "Spectral SC",
    body: null,
    header: null,
  },
  fontSizes: {
    root: "19px",
  },
  colors: {
    header: "#f7eeed",
    button: "#f7eeed",
    footer: "#405372",
    altFooter: "#4f5970",
    body: "white",
    text: "black",
    link: "#405372",
    headings: "#9f4c43",
    borders: "darkgray",
  },
  mediaQueries: {
    small: "@media screen and (min-width: 40em)",
    medium: "@media screen and (min-width: 52em)",
    large: "@media screen and (min-width: 64em)",
    print: "@media print",
  },
  edgeSpacing: "1rem",
  rhythm: 1.47,
}

export const wordpressUrl = "https://wp.dailp.northeastern.edu"

theme.fonts.body = theme.fonts.bodyArr.join(",")
theme.fonts.header = theme.fonts.headerArr.join(",")

export const typography = new Typography({
  baseFontSize: theme.fontSizes.root,
  baseLineHeight: theme.rhythm,
  headerFontFamily: theme.fonts.headerArr,
  bodyFontFamily: theme.fonts.bodyArr,
  bodyColor: "hsl(0, 0%, 0%, 0.95)",
  headerColor: "hsl(0, 0%, 0%, 0.9)",
  // blockMarginBottom: 0.5,
})

export const fullWidth = {
  width: "100%",
  [theme.mediaQueries.medium]: {
    width: "40rem",
  },
  [theme.mediaQueries.large]: {
    width: "50rem",
  },
}

export const largeDialog = {
  width: "95%",
  [theme.mediaQueries.medium]: {
    width: "35rem",
  },
  [theme.mediaQueries.large]: {
    width: "45rem",
  },
}

export const withBg = css`
  z-index: 999;
  background-color: ${theme.colors.body};
  padding: ${theme.rhythm / 4}em;
  border: 1px solid ${theme.colors.text};
  ${theme.mediaQueries.medium} {
    max-width: 70vw;
  }
  ${theme.mediaQueries.print} {
    display: none;
  }
`

export const hideOnPrint = css`
  ${theme.mediaQueries.print} {
    display: none;
  }
`

const button = css`
  font-family: ${theme.fonts.header};
  color: ${theme.colors.link};
  background-color: ${theme.colors.button};
  padding: ${theme.rhythm / 3}rem 1rem;
  margin: 0 1rem;
  cursor: pointer;
  border: 2px solid ${theme.colors.headings};
  &:hover {
    color: ${theme.colors.headings};
    background-color: ${Color(theme.colors.button).lighten(0.2).hsl().string()};
  }
  &:focus,
  &:active {
    outline: none;
    border-style: dashed;
  }

  &[disabled] {
    color: darkgray;
    background-color: lightgray;
    border-color: darkgray;
    opacity: 80;
  }
`

const iconButton = css`
  border: none;
  margin: 0;
  padding: 8px;
  & > svg {
    display: block;
  }
`

const smallCaps = css`
  font-family: ${theme.fonts.smallCaps};
  text-transform: lowercase;
`

const closeBlock = css`
  margin-bottom: ${typography.rhythm(0.5)};
`

export const std = {
  button,
  iconButton,
  smallCaps,
  tooltip: withBg,
  closeBlock,
}

export default theme
