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
  padding: "0 64px",
})

export const footerGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "30px",

  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "32px",
    },
  },
})

export const universityColumn = style({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
})

export const universityTitle = style({
  fontSize: "1.5rem",
  fontFamily: fonts.header,
  color: "white",
  lineHeight: 1.2,
  marginBottom: "16px",

  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: "1.875rem",
    },
  },
})

export const address = style({
  fontStyle: "normal",
  fontSize: "0.875rem",
  lineHeight: 1.6,
})

export const sectionTitle = style({
  fontSize: "1.25rem",
  color: "white",
  fontWeight: 600,
  marginBottom: "16px",
})

export const sitemapNav = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
})

export const sitemapLink = style({
  color: "white",
  textDecoration: "underline",
  fontSize: "0.875rem",
  transition: "opacity 0.2s",

  ":hover": {
    opacity: 0.8,
  },
})

export const aboutSection = style({})

export const aboutText = style({
  fontSize: "0.875rem",
  lineHeight: 1.6,
  marginBottom: "16px",
})

export const aboutLink = style({
  color: "white",
  textDecoration: "underline",

  ":hover": {
    opacity: 0.8,
  },
})

export const ccIcons = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  verticalAlign: "middle",
  marginLeft: "4px",
})

export const ccIcon = style({
  width: "16px",
  height: "16px",
})

export const sourceLink = style({
  color: "white",
  textDecoration: "underline",
  fontSize: "0.875rem",
  display: "block",
  marginBottom: "16px",

  ":hover": {
    opacity: 0.8,
  },
})

export const lastUpdated = style({
  fontSize: "0.875rem",
})

export const contactNav = style({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
})

export const contactLink = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  color: "white",
  textDecoration: "underline",
  fontSize: "0.875rem",
  transition: "opacity 0.2s",

  ":hover": {
    opacity: 0.8,
  },
})

export const copyrightSection = style({
  marginTop: "48px",
  paddingTop: "32px",
  borderTop: "1px solid rgba(255,255,255,0.2)",
  textAlign: "center",
  fontSize: "0.875rem",
})
