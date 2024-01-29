import { style } from "@vanilla-extract/css"
import { colors, fonts, hspace, rhythm } from "src/style/constants"

export const breadcrumbs = style({
  fontFamily: fonts.body,
  fontWeight: "normal",
  listStyle: "none",
  paddingInlineStart: 0,
  marginBottom: rhythm(1 / 2),
  marginLeft: 0,
  marginTop: 0,
})
/**
 * 
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: "rgba(255,255,255,0.65)",
        color: "black",
        padding: 40,
        backdropFilter: "blur(2px)",
        border: `4px solid ${border}`,
 */

export const statusMessage = style({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255,255,255,0.65)",
  color: "black",
  padding: 40,
  backdropFilter: "blur(2px)",
  border: "4px solid grey",
})

export const statusMessageError = style({
  borderColor: "red",
})
