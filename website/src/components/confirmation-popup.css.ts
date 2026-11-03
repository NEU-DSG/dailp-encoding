import { style } from "@vanilla-extract/css"
import { button } from "./button.css"

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

export const buttonStyle = style([
  button,
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "8px 12px",
  },
])
