import { style } from "@vanilla-extract/css"

export const overlay = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(207, 205, 205, 0.65)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
})

export const modal = style({
  backgroundColor: "white",
  borderRadius: "45px",
  padding: "32px",
  maxWidth: "600px",
  width: "90%",
  maxHeight: "80vh",
  overflowY: "auto",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  border: "10px solid #A4B3D1",
})

export const title = style({
  fontSize: "24px",
  fontWeight: "600",
  textAlign: "center",
  marginBottom: "8px",
  color: "#333",
})

export const subtitle = style({
  fontSize: "14px",
  color: "#666",
  textAlign: "center",
  marginBottom: "24px",
})

export const formGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  marginBottom: "16px",
})

export const fieldGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
})

export const fullWidthGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  marginBottom: "16px",
})

export const label = style({
  fontSize: "16px",
  fontWeight: "500",
  marginBottom: "3px",
  color: "#000000ff",
})

export const input = style({
  padding: "8px 12px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontFamily: "'Inter', sans-serif",
  fontSize: "14px",
  backgroundColor: "white",
})

export const addButton = style({
  alignSelf: "flex-start",
  padding: "12px 35px",
  backgroundColor: "#405372",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "14px",
  fontWeight: "600",
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

export const editButton = style({
  padding: "12px 60px",
  backgroundColor: "#497CC7",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  minWidth: "120px",
  boxShadow: "0 4px 4px rgba(0, 0, 0, 0.3)",
  selectors: {
    "&:hover": {
      backgroundColor: "#3867AD",
    },
  },
})

export const buttonGroup = style({
  display: "flex",
  gap: "50px",
  justifyContent: "center",
  marginTop: "24px",
})

export const modalCancelButton = style({
  padding: "12px 60px",
  backgroundColor: "white",
  color: "#666",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  minWidth: "120px",
  boxShadow: "0 4px 4px rgba(0, 0, 0, 0.3)",
  selectors: {
    "&:hover": {
      backgroundColor: "#e8e8e8ff",
    },
  },
})

export const submitButton = style({
  padding: "12px 60px",
  backgroundColor: "#497CC7",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  minWidth: "120px",
  boxShadow: "0 4px 4px rgba(0, 0, 0, 0.3)",
  selectors: {
    "&:hover": {
      backgroundColor: "#3867AD",
    },
  },
})

export const select = style({
  padding: "0.5rem",
  border: "1px solid #ccc",
  borderRadius: "0.25rem",
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
