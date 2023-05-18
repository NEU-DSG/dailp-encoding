import { createTheme } from "@vanilla-extract/css"
import { darken, lighten, rgba } from "polished"
import { rootFontSize } from "src/style/constants"
import { themeContract } from "src/style/theme-contract.css"

export const themeClass = createTheme(themeContract, {
  fontSizes: {
    root: rootFontSize,
  },
  colors: {
    // header: "black",
    // button: "#fbf6ec",
    // buttonHover: lighten(0.2, "black"),
    // footer: "#9d2832",
    // altFooter: "#9d2832",
    // body: "#fbf6ec",
    // text: "black",
    // link: "#970b26",
    // headings: "#e6b469",
    // focus: "#e6b469",
    // bodyHeadings: "black",
    // borders: "darkgray",
    // headerButton: "#fbf6ec",
    primary: "#AD1D35",
    primaryDark: "#6E1322",
    primaryContrast: "white",
    primaryText: "white",
    secondary: "#5C3A37",
    secondaryDark: darken(0.2, "#9d2832"),
    secondaryContrast: lighten(0.6, "#9d2832"),
    secondaryText: "white",
    body: "white",
    bodyDark: darken(0.1, "#fbf6ec"),
    text: rgba("black", 0.95),
    link: "#405372",
    headings: "#ad7d77",
    focus: "#e6b469",
    borders: "darkgray",
  },
  fonts: {
    header: `"Quattrocento Sans", "Segoe UI", "Arial", "sans-serif"`,
    body: `"Charis SIL", Digohweli, serif, Arial`,
    cherokee: `Digohweli, "Charis SIL", "serif", "Arial"`,
    smallCaps: "Charis SIL",
  },
})
