import { globalStyle, style } from "@vanilla-extract/css"
import { important, margin } from "polished"
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

export const overlay = style({
  position: "fixed",
  width: "100vw",
  height: "100vh",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(240, 240, 240, 0.9)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

export const confirmationBox = style({
  backgroundColor: "white",
  padding: "16px",
  borderRadius: 0,
  border: "1px solid #ccc",
  width: "90%",
  maxWidth: "280px",
  textAlign: "center",
})

export const confirmationText = style({
  margin: "0 0 16px 0",
  fontSize: "14px",
  fontWeight: "bold",
  color: "#333",
})

export const modalButtonGroup = style({
  display: "flex",
  gap: "10px",
  justifyContent: "center",
})

export const buttonStyle = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  width: "100%",
  padding: "8px 12px",
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
