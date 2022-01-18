import Typography from "typography"

const theme = {
  fonts: {
    // 4 fonts total: header + sans body, serif body, serif smallcaps, Cherokee.
    // Noto Serif supports glottal stops and more accents than other fonts.
    bodyArr: ["Charis SIL", "Digohweli", "serif", "Arial"],
    headerArr: ["Quattrocento Sans", "Segoe UI", "Arial", "sans-serif"],
    cherokee: `"Digohweli", "Charis SIL", "serif", "Arial"`,
    smallCaps: "Charis SIL",
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
    text: "hsl(0, 0%, 0%, 0.95)",
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
}

export const wordpressUrl = "https://wp.dailp.northeastern.edu"

// theme.fonts.body = theme.fonts.bodyArr.join(",")
// theme.fonts.header = theme.fonts.headerArr.join(",")

export const typography = new Typography({
  baseFontSize: theme.fontSizes.root,
  baseLineHeight: 1.47,
  headerFontFamily: theme.fonts.headerArr,
  bodyFontFamily: theme.fonts.bodyArr,
  bodyColor: theme.colors.text,
  headerColor: theme.colors.headings,
})

// const iconButton = css`
//   border: none;
//   margin: 0;
//   padding: 8px;
//   & > svg {
//     display: block;
//   }
// `

export default theme
