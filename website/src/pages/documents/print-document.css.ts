import { globalStyle, style } from "@vanilla-extract/css"
import {
  colors,
  fontSize,
  fonts,
  mediaQueries,
  thickness,
  vspace,
} from "src/style/constants"

const printFonts = {
  quattrocento: `"Quattrocento", serif`,
  spectral: `"Spectral", serif`,
}

const printFontSizes = {
  medium: "0.95rem",
  large: "1.1rem",
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
    },
  },
})

export const printLegendSyllabary = style({
  "@media": {
    [mediaQueries.print]: {
      fontFamily: fonts.body,
      fontSize: printFontSizes.medium,
      lineHeight: 1.2,
      fontWeight: 400,
    },
  },
})

export const printLegendTranslation = style({
  "@media": {
    [mediaQueries.print]: {
      fontFamily: fonts.header,
      fontSize: fontSize.small,
      lineHeight: 1.2,
      fontWeight: 400,
    },
  },
})

export const printLegendParagraph = style({
  "@media": {
    [mediaQueries.print]: {
      fontFamily: printFonts.quattrocento,
      fontSize: printFontSizes.medium,
      lineHeight: 1.2,
      fontWeight: 400,
    },
  },
})

export const printDocument = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      paddingBottom: vspace.double,
    },
  },
})

globalStyle(`${printDocument} button`, {
  display: "none",
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
      bottom: vspace.small,
      left: 0,
      right: 0,
      fontFamily: printFonts.spectral,
      borderTop: `${thickness.thin} solid ${colors.text}`,
      paddingTop: vspace.small,
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
      lineHeight: 1.2,
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
      lineHeight: 1.2,
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
      lineHeight: 1.2,
    },
  },
})
