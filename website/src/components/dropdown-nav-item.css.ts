import { style, globalStyle } from "@vanilla-extract/css"

export const dropdownContainer = style({
  position: "relative",
  listStyle: "none",
})

export const dropdownToggle = style({
  background: "none",
  border: "none",
  color: "white",
  fontFamily: "Inter",
  fontSize: "20px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
  ":hover": {
    textDecoration: "underline",
  },
})

export const toggleIcon = style({
  fontSize: "0.8rem",
  transition: "transform 0.3s ease",
  textDecoration: "none",
  display: "inline-block",
  selectors: {
    [`${dropdownToggle}:hover &`]: {
      transform: "rotate(180deg)",
      textDecoration: "none",
    },
  },
})

export const dropdownMenu = style({
  position: "absolute",
  top: "100%",
  left: 0,
  padding: 0,
  margin: 0,
  whiteSpace: "nowrap",
  width: "auto",
  maxWidth: "none",
  listStyle: "none",
  backgroundColor: "white",
  border: "1px solid black",
  minWidth: "180px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  zIndex: 1000,
})

export const dropdownItem = style({
  display: "block",
  padding: "8px 12px",
  color: "#000000",
  fontFamily: "Inter",
  textDecoration: "none",
  ":hover": { 
    backgroundColor: "#ECECEC",
    textDecoration: "none"
},
})

globalStyle(`${dropdownMenu} a, ${dropdownMenu} a:visited, ${dropdownMenu} a:active`, {
  display: "block",
  color: "#000000",
  textDecoration: "none",
  listStyleType: "none",
  fontWeight: "500",
  borderBottom: "1px solid black",
  fontFamily: "Inter",
  paddingTop: "15px",
  paddingBottom: "15px",
})

globalStyle(`${dropdownMenu} a:hover`, {
  backgroundColor: "#ECECEC",
  textDecoration: "none",
})

globalStyle(`${dropdownMenu} li:last-child a`, {
  borderBottom: "none",
})