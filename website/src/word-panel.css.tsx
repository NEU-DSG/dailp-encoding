import { style, styleVariants } from "@vanilla-extract/css"
import { closeButton } from "./morpheme.css"
import sprinkles, { hspace, mediaQueries, theme, vspace } from "./sprinkles.css"

export const wordPanelButton = styleVariants({
  basic: [closeButton],
})

export const wordPanelContent = style({
  position: "sticky",
  top: 125,
  height: "25rem",
  border: "none",
  borderRadius: "4px",
  padding: "8px",
  fontFamily: theme.fonts.cherokee,
  "@media": {
    [mediaQueries.medium]: {
      border: "1px solid #ddd",
    },
  },
})

export const audioContainer = style({ paddingLeft: "40%" })
