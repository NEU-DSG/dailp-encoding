import { globalStyle, style } from "@vanilla-extract/css"
import { fonts } from "src/style/constants"

export const navBar = style({
  width: "100vw",
  height: "4rem",
  display: "flex",
  marginBottom: "0px",
  backgroundColor: "#823E2D",
  alignItems: "center",
  alignContent: "center",
  paddingLeft: "10px",
})

export const navLinks = style({
  fontFamily: fonts.header,
  fontWeight: "500",
  listStyleType: "none",
  display: "flex",
  flexDirection: "row",
  gap: "2.5rem",
  margin: 0,
  padding: 0, 
  marginLeft: "3rem",
  height: "100%",
  alignItems: "stretch",
})

globalStyle(`${navLinks} a`, {
  display: "flex",
  alignItems: "center",
  height: "100%",
  textDecoration: "none",
  color: "#ffffffff",
  fontWeight: "500",
  fontSize: "20px",
  transition: "color 0.2s ease",
})

globalStyle(`${navLinks} > li`, {
  display: "flex",
  alignItems: "center",
  height: "100%",
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
})