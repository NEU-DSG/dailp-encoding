import { globalStyle, style } from "@vanilla-extract/css"
import { margin } from "polished"
import { colors, hspace, radii, vspace } from "src/style/constants"
import { hideOnPrint } from "src/style/utils.css"

export const wide = style({ width: "100%" })

export const container = style([
  {
    display: "inline-block",
    background: "#a9a9a9",
    height: vspace.quarter,
    borderRadius: radii.medium,
    flex: 1,
  },
  margin(vspace.medium, hspace.halfEdge),
])

export const fill = style({
  width: "100%",
  height: "100%",
  transformOrigin: "left",
  background: "#444444",
  borderRadius: "inherit",
  textAlign: "right",
})

export const audioElement = style([
  hideOnPrint,
  {
    display: "flex",
    marginLeft: hspace.halfEdge,
    alignItems: "center",
  },
])

globalStyle(`${audioElement} svg`, {
  fill: colors.primary,
  cursor: "pointer",
})

// export const timestamp = css`
//   //margin-left: 0.4rem;
//   //cursor: pointer;
//   display: inline;
//   text-align: center;
//   //width: 100% !important;
//   text-color: ${theme.colors.link};
//   }
// `
