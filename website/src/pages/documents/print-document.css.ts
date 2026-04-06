import { globalStyle, style } from "@vanilla-extract/css"
import {
  colors,
  fontSize,
  fonts,
  hspace,
  mediaQueries,
  vspace,
} from "src/style/constants"

const printFonts = {
  quattrocento: `"Quattrocento", serif`,
  spectral: `"Spectral", serif`,
}

const printFontSizes = {
  medium: "0.95rem",
  large: "1.1rem",
  breadcrumb: "1rem",
  legend: "0.842rem",
  legendItem: "1rem",
}

export const printHeading = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      fontFamily: printFonts.quattrocento,
      fontSize: printFontSizes.large,
      fontWeight: 700,
      lineHeight: 1,
      marginBottom: 0,
    },
  },
})

export const printBreadcrumbs = style({
  "@media": {
    [mediaQueries.print]: {
      fontFamily: printFonts.quattrocento,
      fontSize: "1.105rem",
      fontWeight: 400,
      lineHeight: 1,
      marginTop: 0,
      marginBottom: 0,
    },
  },
})

export const printBreadcrumbFirst = style({
  "@media": {
    [mediaQueries.print]: {
      fontFamily: printFonts.quattrocento,
      fontSize: "1.105rem",
      fontWeight: 400,
      lineHeight: 1,
    },
  },
})

export const printLegendBox = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      textAlign: "left",
      marginTop: vspace.one,
      paddingTop: "0.794rem",
      paddingBottom: vspace.half,
      borderRadius: "15px",
      backgroundColor: "#f0f0f0d1",
      border: "1px solid #000",
      WebkitPrintColorAdjust: "exact",
      printColorAdjust: "exact",
    },
  },
})

export const printLegendSyllabary = style({
  "@media": {
    [mediaQueries.print]: {
      fontFamily: fonts.header,
      fontSize: printFontSizes.legendItem,
      lineHeight: 1.2,
      marginTop: vspace.one,
      marginBottom: 0,
      fontWeight: 400,
    },
  },
})

export const printLegendTranslation = style({
  "@media": {
    [mediaQueries.print]: {
      fontFamily: fonts.header,
      fontSize: printFontSizes.legendItem,
      lineHeight: 1.2,
      marginBottom: 0,
      fontWeight: 400,
    },
  },
})

export const printLegendParagraph = style({
  "@media": {
    [mediaQueries.print]: {
      fontFamily: fonts.header,
      fontSize: printFontSizes.legendItem,
      lineHeight: 1.2,
      marginBottom: 0,
      fontWeight: 400,
    },
  },
})

export const printLegendPhonetics = style({
  "@media": {
    [mediaQueries.print]: {
      fontFamily: fonts.header,
      fontSize: printFontSizes.legendItem,
      lineHeight: 1.2,
      marginBottom: 0,
      fontWeight: 400,
    },
  },
})

export const printLegendWordParts = style({
  "@media": {
    [mediaQueries.print]: {
      fontFamily: fonts.header,
      fontSize: printFontSizes.legendItem,
      lineHeight: 1.2,
      marginBottom: 0,
      fontWeight: 400,
    },
  },
})

export const printSectionHeading = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: printFonts.quattrocento,
      fontSize: "1.158rem",
      fontWeight: 700,
      lineHeight: 1.2,
      marginTop: vspace.one,
      marginBottom: vspace.quarter,
    },
  },
})

export const printSectionHeadingRule = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      width: "418px",
      borderTop: `1px solid ${colors.text}`,
      marginTop: vspace.quarter,
    },
  },
})

export const printHeader = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      textAlign: "center",
    },
  },
})

export const printDocument = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      paddingTop: vspace.one,
      paddingBottom: vspace.double,
    },
  },
})

globalStyle(`${printDocument} button`, {
  display: "none",
})

globalStyle(`${printDocument} h1`, {
  "@media": {
    [mediaQueries.print]: {
      marginBottom: 0,
    },
  },
})

globalStyle(`${printDocument} h1 + ul`, {
  "@media": {
    [mediaQueries.print]: {
      marginTop: 0,
      marginBottom: 0,
    },
  },
})

globalStyle(`${printDocument} ul li:last-child::after`, {
  "@media": {
    [mediaQueries.print]: {
      content: `""`,
      padding: 0,
    },
  },
})

globalStyle(`${printLegendBox} h2`, {
  "@media": {
    [mediaQueries.print]: {
      textAlign: "center",
    },
  },
})

globalStyle(`${printLegendBox} p`, {
  "@media": {
    [mediaQueries.print]: {
      paddingLeft: hspace.edge,
    },
  },
})

export const printOnly = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: { display: "block" },
  },
})

export const printFooter = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: -1,
      fontFamily: printFonts.spectral,
      backgroundColor: colors.body,
    },
  },
})

export const printFooterDetails = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "inline",
      fontSize: fontSize.small,
      fontWeight: 400,
      lineHeight: 0.7,
    },
  },
})

export const printFooterTitle = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "inline",
      fontSize: fontSize.small,
      fontWeight: 400,
      lineHeight: 0.7,
    },
  },
})

export const printFooterTitleBold = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "inline",
      fontSize: fontSize.small,
      fontWeight: 700,
      lineHeight: 0.7,
    },
  },
})

export const printFooterContributors = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      fontFamily: fonts.header,
      fontSize: "11px",
      fontWeight: 400,
    },
  },
})
