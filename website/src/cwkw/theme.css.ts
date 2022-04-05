import { createTheme, createThemeContract, style } from "@vanilla-extract/css";
import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";
import { lighten } from "polished";
import { colors, rootFontSize, theme } from "src/sprinkles.css";
import { marginX, paddingX, paddingY } from "src/style-utils";


export const themeClass = createTheme(theme, {
  fontSizes: {
    root: rootFontSize,
  },
  colors: {
    header: "black",
    button: "black",
    buttonHover: lighten(0.2, "black"),
    footer: "#930",
    altFooter: "#c30",
    body: "#fbf4e5",
    text: "#fbf4e5",
    link: "#405372",
    headings: "#970b26",
    bodyHeadings: "black",
    borders: "darkgray",
  },
  fonts: {
    header: `"Quattrocento Sans", "Segoe UI", "Arial", "sans-serif"`,
    body: `"Charis SIL", Digohweli, serif, Arial`,
    cherokee: `Digohweli, "Charis SIL", "serif", "Arial"`,
    smallCaps: "Charis SIL",
  },
})