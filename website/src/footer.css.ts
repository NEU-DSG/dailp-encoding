import { style, globalStyle } from "@vanilla-extract/css"
import { hideOnPrint } from "./style/utils.css"
import { fonts } from "./style/constants"

export const footer = style([hideOnPrint])

export const sponsorSection = style({
  backgroundColor: "#FAF4EF",
  padding: "48px 32px",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "48px 64px",
    },
  },
})

export const supportedByTitle = style({
  textAlign: "center",
  color: "#8b4513",
  marginBottom: "32px",
  fontFamily: fonts.header,
})

export const sponsorLogosContainer = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: "32px",
  maxWidth: "1152px",
  margin: "0 auto",
  "@media": {
    "screen and (min-width: 768px)": {
      gap: "48px",
    },
    "screen and (min-width: 1024px)": {
      gap: "64px",
    },
  },
})

export const sponsorLogo = style({
  height: "64px",
  width: "auto",
  objectFit: "contain",
  "@media": {
    "screen and (min-width: 768px)": {
      height: "80px",
    },
  },
})

export const sponsorLogoTall = style({
  height: "80px",
  width: "auto",
  objectFit: "contain",
  "@media": {
    "screen and (min-width: 768px)": {
      height: "96px",
    },
  },
})

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
  width: "150px",
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
