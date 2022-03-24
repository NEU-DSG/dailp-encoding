import { style, styleVariants } from "@vanilla-extract/css"
import { closeButton } from "./morpheme.css"
import sprinkles, {
  colors,
  hspace,
  mediaQueries,
  theme,
  vspace,
} from "./sprinkles.css"

export const cherHeader = style({
  color: colors.headings,
  fontFamily: theme.fonts.cherokee,
})

export const wordPanelButton = styleVariants({
  basic: [closeButton],
})

export const wordPanelContent = style({
  position: "sticky",
  top: 125,
  height: "calc(100vh - 150px)",
  border: "none",
  borderRadius: "4px",
  padding: "8px",
  fontFamily: theme.fonts.body,
  "@media": {
    [mediaQueries.medium]: {
      border: "1px solid #ddd",
    },
  },
})

export const audioContainer = style({ paddingLeft: "40%" })

export const table = style({
  width: "max-content",
  borderBottom: "0px solid #ddd",
  fontFamily: theme.fonts.body,
  padding: "0px",
  borderRadius: "0px",
})
