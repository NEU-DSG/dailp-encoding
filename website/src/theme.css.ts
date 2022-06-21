import { createTheme } from "@vanilla-extract/css"
import { darken, lighten, padding, rgba } from "polished"
import { rootFontSize } from "src/style/constants"
import themeContract from "src/style/theme-contract.css"

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

export const themeClass = createTheme(themeContract, {
  fontSizes: {
    root: rootFontSize,
  },
  colors: {
    primary: "#A25B5B",
    primaryDark: darken(0.1, "#A25B5B"),
    primaryContrast: "#F8ECD1",
    primaryText: "white",
    secondary: "#C0D8C0",
    secondaryDark: darken(0.1, "#C0D8C0"),
    secondaryContrast: darken(0.65, "#C0D8C0"),
    secondaryText: rgba("black", 0.95),
    body: "white",
    bodyDark: darken(0.1, "white"),
    text: rgba("black", 0.95),
    link: "#85586F",
    focus: "#85586F",
    headings: rgba("black", 0.95),
    borders: "darkgray",
    // primary: "#405372",
    // primaryDark: darken(0.1, "#405372"),
    // primaryContrast: "white",
    // primaryText: "white",
    // secondary: "#f7eeed",
    // secondaryDark: darken(0.1, "#f7eeed"),
    // secondaryContrast: "#9f4c43",
    // secondaryText: "black",
    // body: "white",
    // text: "hsl(0, 0%, 0%, 0.95)",
    // link: "#405372",
    // focus: "#9f4c43",
    // headings: "#9f4c43",
    // borders: "darkgray",
  },
  fonts: {
    header: `"Quattrocento Sans", "Segoe UI", "Arial", "sans-serif"`,
    body: `"Charis SIL", Digohweli, serif, Arial`,
    cherokee: `Digohweli, "Charis SIL", "serif", "Arial"`,
    smallCaps: "Charis SIL",
  },
})

export const wordpressUrl = "https://wp.dailp.northeastern.edu"

// theme.fonts.body = theme.fonts.bodyArr.join(",")
// theme.fonts.header = theme.fonts.headerArr.join(",")

// const iconButton = css`
//   border: none;
//   margin: 0;
//   padding: 8px;
//   & > svg {
//     display: block;
//   }
// `

export default theme
