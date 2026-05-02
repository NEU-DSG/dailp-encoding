// New document info styles
import { style } from "@vanilla-extract/css"

export const container = style({
  backgroundColor: "#ffffff",
  padding: "32px",
  maxWidth: "900px",
  margin: "40px auto 50px auto",
})

export const header = style({
  position: "relative",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
})

export const editButton = style({
  position: "absolute",
  top: "0",
  right: "0",
  backgroundColor: "#405372",
  color: "white",
  border: "none",
  padding: "12px 30px",
  borderRadius: "4px",
  fontFamily: "'Inter', sans-serif",
  fontWeight: "600",
  fontSize: "16px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  ":hover": {
    backgroundColor: "#6F85A9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
})

export const editIcon = style({
  fontSize: "12px",
})

export const title = style({
  fontSize: "28px",
  fontWeight: "600",
  color: "#333333",
  margin: "-5rem 0 8px 0",
})

export const subtitle = style({
  fontSize: "16px",
  color: "#666666",
  margin: "10px 0 50px 0",
})

export const infoSection = style({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
})

export const field = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  paddingBottom: "16px",
  borderBottom: "1px solid #ADADAD",
})

export const label = style({
  fontSize: "20px",
  fontWeight: "600",
  color: "#8D6660",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
})

export const value = style({
  fontSize: "16px",
  color: "#333333",
  lineHeight: 1.5,
})

export const link = style({
  color: "#4A90E2",
  textDecoration: "underline",
})

export const message = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "fixed",
  borderRadius: "8px",
  zIndex: 9999,
  fontSize: "16px",
  background: "white",
  color: "#black",
  boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
})

export const messageCloseButton = style({
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
})

export const globalMessageOverlay = style({
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
})

export const globalMessageBox = style({
  background: "white",
  padding: "20px 24px",
  borderRadius: "10px",
  minWidth: "320px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
})

export const success = style({
  borderLeft: "6px solid #2ecc71",
})

export const error = style({
  borderLeft: "6px solid #e74c3c",
})
