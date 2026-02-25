import { style } from "@vanilla-extract/css"

export const fullWidthGroup = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  marginBottom: "16px",
})

export const label = style({
  fontSize: "16px",
  fontWeight: "500",
  marginBottom: "7px",
  color: "#000000ff",
})

export const tagDropdownContainer = style({
  position: "relative",
  marginTop: "8px",
})

export const addTagButton = style({
  alignSelf: "flex-start",
  padding: "12px 35px",
  backgroundColor: "#405372",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "14px",
  fontWeight: 600,
  fontFamily: "'Inter', sans-serif",
  cursor: "pointer",
  marginTop: "8px",
  selectors: {
    "&:hover": {
      backgroundColor: "#6F85A9",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  },
})

export const tagDropdown = style({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: "white",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  zIndex: 10,
  maxHeight: "200px",
  overflowY: "auto",
})

export const tagOption = style({
  width: "100%",
  padding: "8px 12px",
  backgroundColor: "white",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "14px",
  color: "#333",
  borderBottom: "1px solid #eee",
})
