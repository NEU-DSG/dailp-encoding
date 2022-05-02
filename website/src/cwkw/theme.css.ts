import { createTheme, createThemeContract, style } from "@vanilla-extract/css"
import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles"
import { lighten } from "polished"
import { rootFontSize, theme } from "src/sprinkles.css"
import { marginX, paddingX, paddingY } from "src/style-utils"

export const themeClass = createTheme(theme, {
  fontSizes: {
    root: rootFontSize,
  },
  colors: {
    header: "black",
    button: "black",
    buttonHover: lighten(0.2, "black"),
    footer: "#9d2832",
    altFooter: "#9d2832",
    body: "#fbf6ec",
    text: "black",
    link: "#970b26",
    headings: "#e6b469",
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

export const colors = {
  ...theme.colors,
  transparent: "transparent",
  inherit: "inherit",
}
