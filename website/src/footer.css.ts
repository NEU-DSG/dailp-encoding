import { style, globalStyle } from "@vanilla-extract/css"
import { hideOnPrint } from "./style/utils.css"
import { fonts } from "./style/constants"

export const footer = style([hideOnPrint])

export const darkSection = style({
  backgroundColor: "#405372",
  color: "white",
  padding: "48px 0",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "48px 64px",
    },
  },
})

export const darkContainer = style({
  width: "100%",
  maxWidth: "1150px",
  margin: "0 auto",
  padding: "0 32px",
})

export const footerGrid = style({
  display: "grid",
  gap: "40px",
  gridTemplateColumns: "1fr",

  "@media": {
    // Tablet/Mobile
    "screen and (min-width: 600px)": {
      gridTemplateColumns: "1fr 1fr",
      gap: "48px",
    },

    // Computer
    "screen and (min-width: 900px)": {
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "56px",
    },
  },
})

export const northeasternColumn = style({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  gridColumn: "auto",
})

export const neuLogo = style({
  width: "200px",
  height: "auto",
  marginBottom: "16px",
})

export const toolsNav = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
})

export const toolsLink = style({
  color: "white",
  textDecoration: "underline",
  fontSize: "0.875rem",
  transition: "opacity 0.2s",
  ":hover": {
    fontWeight: "bold",
  },
})

export const lastUpdated = style({
  fontSize: "0.875rem",
})

export const footerColumn = style({
  display: "flex",
  flexDirection: "column",
  gap: 0,
  paddingBottom: "3rem",
})

export const sectionTitle = style({
  fontSize: "1.25rem",
  color: "white",
  fontWeight: 600,
  marginBottom: "16px",
})

export const aboutText = style({
  fontSize: "0.875rem",
  lineHeight: 1.6,
  marginBottom: 0,
  marginTop: 0,
})

export const aboutLink = style({
  color: "white",
  textDecoration: "underline",
  ":hover": {
    opacity: 0.8,
  },
})

export const footerBottom = style({
  gridColumn: "1 / -1",
  textAlign: "center",
  padding: "24px 0",
  borderTop: "1px solid rgba(255,255,255,0.2)",
  fontSize: "0.875rem",
})
