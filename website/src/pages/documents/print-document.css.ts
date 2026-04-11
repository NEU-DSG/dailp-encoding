import { globalStyle, style } from "@vanilla-extract/css"
import { wordGroup, wordGroupInline } from "src/segment.css"
import { fonts, hspace, mediaQueries, vspace } from "src/style/constants"

const printFonts = {
  quattrocento: `"Quattrocento", serif`,
}

const printFontSizes = {
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

export const printHeader = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      textAlign: "center",
      breakAfter: "avoid",
    },
  },
})

export const printDocument = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      paddingTop: vspace.one,
      paddingBottom: 0,
      fontSize: "10pt",
      width: "100%",
    },
  },
})

export const printBlankPage = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      breakBefore: "page",
      height: "99vh",
      fontStyle: "italic",
      fontFamily: "serif",
      fontSize: "1rem",
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

export const printLegendBox = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      textAlign: "left",
      marginTop: vspace.quarter,
      paddingTop: vspace.quarter,
      paddingBottom: vspace.quarter,
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
      fontSize: "1rem",
      lineHeight: 1.2,
      marginTop: vspace.one,
      marginBottom: 0,
      fontWeight: 400,
    },
  },
})

export const printLegendItem = style({
  "@media": {
    [mediaQueries.print]: {
      fontFamily: fonts.header,
      fontSize: "1rem",
      lineHeight: 1.2,
      marginBottom: 0,
      fontWeight: 400,
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

export const printSyllabaryLine = globalStyle(
  `.${wordGroup} div[lang="chr"], .${wordGroupInline} div[lang="chr"]`,
  {
    "@media": {
      [mediaQueries.print]: {
        fontFamily: `"Charis SIL", serif`,
        fontSize: "12pt",
        fontWeight: 700,
        lineHeight: 1.2,
        width: "212px",
        height: "28px",
      },
    },
  }
)

export const printPhoneticsLine = globalStyle(
  `.${wordGroup} div:nth-child(2), .${wordGroupInline} div:nth-child(2)`,
  {
    "@media": {
      [mediaQueries.print]: {
        fontFamily: fonts.header,
        fontSize: "10.67pt",
        fontWeight: 400,
        lineHeight: 1.2,
        width: "212px",
        height: "28px",
      },
    },
  }
)

export const printWordPartsLine = globalStyle(
  `.${wordGroup} i, .${wordGroupInline} i`,
  {
    "@media": {
      [mediaQueries.print]: {
        fontFamily: fonts.header,
        fontSize: "10.67pt",
        fontStyle: "italic",
        fontWeight: 400,
        lineHeight: 1.2,
        width: "212px",
        height: "28px",
      },
    },
  }
)

export const printGlossLine = globalStyle(
  `.${wordGroup} i + div, .${wordGroupInline} i + div`,
  {
    "@media": {
      [mediaQueries.print]: {
        fontFamily: fonts.header,
        fontSize: "10pt",
        fontWeight: 400,
        textTransform: "lowercase",
        lineHeight: 1.2,
        width: "212px",
        height: "28px",
      },
    },
  }
)

export const printTranslationLine = globalStyle(
  `.${wordGroup} div:last-child, .${wordGroupInline} div:last-child`,
  {
    "@media": {
      [mediaQueries.print]: {
        fontFamily: fonts.header,
        fontSize: "10.67pt",
        fontWeight: 400,
        lineHeight: 1.2,
        width: "212px",
        height: "28px",
      },
    },
  }
)
