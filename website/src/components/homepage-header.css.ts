import { style } from "@vanilla-extract/css"

export const headerContainer = style({
  position: "relative",
  width: "100%",
  height: "550px",
  overflow: "hidden",
  marginBottom: "80px",
})

export const headerImage = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  position: "relative"
})

export const overlay = style({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(247, 238, 237, 0.8)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  textAlign: "center",
  gap: "1.5rem",
  padding: "1rem",
})

export const title = style({
  fontFamily: "Philosopher, sans-serif",
  fontSize: "5rem",
  margin: 0,
  color: "black"
})

export const subtitle = style({
  fontFamily: "Inter",
  fontSize: "1.3rem",
  margin: 0,
  color: "black",
  fontWeight: "500",
})

export const textBlock = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.5rem",
})

export const buttonGroup = style({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  gap: "1.5rem",
})

export const actionButton = style({
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "16px 35px",
  backgroundColor: "#405372",
  color: "white",
  fontFamily: "'Inter', sans-serif",
  fontWeight: "600",
  fontSize: "18px",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  minWidth: "140px",
  ":hover": {
    backgroundColor: "#6F85A9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
})
