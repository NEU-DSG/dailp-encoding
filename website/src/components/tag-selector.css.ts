import { style } from "@vanilla-extract/css"

export const fullWidthGroup = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  marginBottom: "16px",
})

export const tagsContainer = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-start",
  gap: "8px",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#f9f9f9",
  minHeight: "60px",
})

export const tag = style({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 10px",
  backgroundColor: "white",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontFamily: "'Inter', sans-serif",
  fontSize: "14px",
  color: "#333",
  flex: "initial",
})

export const newTag = style([
  tag,
  {
    backgroundColor: "#DFEFFE",
    color: "#0771D4",
    border: "2px solid #0771D4",
  },
])

export const label = style({
  fontSize: "16px",
  fontWeight: "500",
  marginBottom: "7px",
  color: "#000000ff",
})

export const removeTagButton = style({
  background: "none",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
  color: "#666",
  padding: 0,
  width: "16px",
  height: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
