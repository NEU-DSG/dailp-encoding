import { style } from "@vanilla-extract/css"

export const backdrop = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
})

export const dialog = style({
  position: "relative",
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "40px 74px",
  maxWidth: "600px",
  width: "90%",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
})

export const closeButton = style({
  position: "absolute",
  top: "16px",
  right: "16px",
  padding: "4px",
  cursor: "pointer",
  background: "transparent",
  border: "none",
})

export const title = style({
  font: "normal 400 26px/1.2 'Charis SIL'",
  width: "313px",
  height: "30px",
  marginBottom: "16px",
  marginTop: "0",
})

export const subtitle = style({
  font: "normal 400 16px/1.2 'Charis SIL'",
  marginBottom: "20px",
  marginTop: "0",
})

export const body = style({
  font: "normal 400 18px/1.2 'Charis SIL'",
})
