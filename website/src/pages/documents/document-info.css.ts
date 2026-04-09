// New document info styles
import { style } from "@vanilla-extract/css"
import { fonts } from "src/style/constants"

export const container = style({
  backgroundColor: "#ffffff",
  padding: "32px",
  maxWidth: "900px",
  margin: "40px auto 50px auto",
  "@media": {
    print: {
      padding: "16px",
      margin: "24px auto 0 auto",
    },
  },
})

export const header = style({
  position: "relative",
  textAlign: "center",
  marginBottom: "32px",
  "@media": {
    print: {
      display: "none",
    },
  },
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
  "@media": {
    print: {
      fontSize: "14px",
      margin: "0 0 4px 0",
    },
  },
})

export const subtitle = style({
  fontSize: "16px",
  color: "#666666",
  margin: "10px 0 50px 0",
  "@media": {
    print: {
      fontSize: "8px",
      margin: "4px 0 24px 0",
    },
  },
})

export const infoSection = style({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  "@media": {
    print: {
      gap: "8px",
    },
  },
})

export const field = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  paddingBottom: "16px",
  borderBottom: "1px solid #ADADAD",
  "@media": {
    print: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: "8px",
      paddingBottom: "16px",
      paddingTop: "8px",
    },
  },
})

export const label = style({
  fontSize: "20px",
  fontWeight: "600",
  color: "#8D6660",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  "@media": {
    print: {
      width: "212px",
      height: "25px",
      flexShrink: 0,
      fontFamily: `"Quattrocento", serif`,
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: "20px",
      lineHeight: 1.2,
    },
  },
})

export const value = style({
  fontSize: "16px",
  color: "#333333",
  lineHeight: 1.5,
  "@media": {
    print: {
      width: "424px",
      height: "20px",
      fontFamily: fonts.header,
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "18px",
      lineHeight: 1.2,
    },
  },
})

export const link = style({
  color: "#4A90E2",
  textDecoration: "underline",
})
