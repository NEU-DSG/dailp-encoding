import { style } from "@vanilla-extract/css"

export const buttons = style({
  display: "flex",
  gap: "12px",
  marginTop: "24px",
  justifyContent: "flex-end",
})

export const cancelButton = style({
  padding: "8px 16px",
  cursor: "pointer",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "white",
})

export const confirmButton = style({
  padding: "8px 16px",
  cursor: "pointer",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#9f4d43",
  color: "white",
})
