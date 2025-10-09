import { createVar, fallbackVar, style } from "@vanilla-extract/css"
import { colors, mediaQueries } from "src/style/constants"
import { media, onHover } from "src/style/utils"

export const linkColor = createVar()

const filledLinkColor = fallbackVar(linkColor, colors.link)

export const link = style([
  {
    color: filledLinkColor,
    borderRadius: 0,
    outlineColor: filledLinkColor,
    textDecoration: "underline dotted 0.08em",
    textDecorationSkipInk: "none",
    ":focus-visible": {
      textDecoration: "none",
    },
    ":active": {
      textDecorationStyle: "solid",
    },
  },
  onHover({ textDecorationStyle: "solid" }),
  media(mediaQueries.print, {
    color: "inherit",
    textDecoration: "none",
  }),
])
