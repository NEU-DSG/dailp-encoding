import { style } from "@vanilla-extract/css"
import { colors, fonts, hspace } from "src/style/constants"
import { paddingX } from "src/style/utils"
import { hideOnPrint } from "src/style/utils.css"
import * as baseLayout from "../../layout.css"

export const citationBar = style([
  hideOnPrint,
  paddingX(hspace.edge),
  {
    backgroundColor: colors.secondary,
    color: colors.primaryText,
    fontFamily: fonts.header,
    display: "flex",
    justifyContent: "center",
  },
])

export const citationInner = style([
  baseLayout.headerContents,
  {
    paddingTop: "0.75rem",
    paddingBottom: "0.75rem",
    borderBottom: `1px ridge ${colors.borders}`,
  },
])

export const citationText = style({
  fontSize: "0.875rem",
  lineHeight: 1.6,
  margin: 0,
  wordBreak: "break-word",
  color: colors.primaryText,
})

export const citationLabel = style({
  fontWeight: 700,
  color: colors.primaryText,
})
