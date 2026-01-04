import { globalStyle, style } from "@vanilla-extract/css"
import { fonts } from "src/style/constants"

export const navBar = style({
  width: "100%",
  height: "5rem",
  overflow: "visible",
  marginBottom: "0px",
  backgroundColor: "#823E2D",
  alignContent: "center"
})

export const navLinks = style({
  fontFamily: fonts.header,
  fontWeight: "500",
  listStyleType: "none",
  display: "flex",
  flexDirection: "row",
  gap: "2.5rem",
  paddingTop: "5px",
  paddingBottom: "5px",
  marginLeft: "1rem",
  alignItems: "center",
})

globalStyle(`${navLinks} a`, {
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  color: "#ffffffff",
  fontWeight: "500",
  fontSize: "20px",
  transition: "color 0.2s ease",
})

globalStyle(`${navLinks} a:hover`, {
  textDecoration: "underline",
  fontWeight: "700",
})

export const navIcons = style({
  color: "white",
  display: "flex",
  flexDirection: "row",
  gap: "2.5rem",
  justifyContent: "flex-end",
  alignItems: "center",
  fontSize: "1.6rem",
  width: "100%",
  paddingRight: "3rem",
  transition: "color 0.3s",
  cursor: "pointer"
})

globalStyle(`${navIcons} i:hover`, {
  color: "#d7d7d7ff",
  transform: "scale(1.2)"
})