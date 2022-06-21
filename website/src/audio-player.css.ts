import { globalStyle, style } from "@vanilla-extract/css"
import { important, margin } from "polished"
import { colors, hspace, radii, vspace } from "src/style/constants"

export const wide = style({ width: "100%" })

export const container = style([
  {
    display: "inline-block",
    background: "#a9a9a9",
    height: vspace.quarter,
    borderRadius: radii.medium,
  },
  important({ width: "75%" }),
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

export const audioElement = style({
  display: "inline",
  marginLeft: hspace.halfEdge,
  cursor: "pointer",
  width: "100%",
  alignItems: "center",
})

globalStyle(`${audioElement} svg`, {
  fill: colors.primary,
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
