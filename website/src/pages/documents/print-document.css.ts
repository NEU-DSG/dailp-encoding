import { globalStyle, style } from "@vanilla-extract/css"
import { wordGroup, wordGroupInline } from "src/segment.css"
import {
  colors,
  fonts,
  hspace,
  mediaQueries,
  thickness,
  vspace,
} from "src/style/constants"

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

export const printTitle = style({
  "@media": {
    [mediaQueries.print]: {
      maxWidth: "23.68rem",
      margin: "0 auto",
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

export const printDialogContent = style({
  display: "flex",
  flexDirection: "column",
})

export const printDialogContentScrollable = style({
  maxHeight: "22rem",
  overflowY: "auto",
})

export const printViewDropdownWrapper = style({
  marginTop: "4.21rem",
})

export const dialogDividerContainer = style({
  display: "flex",
  justifyContent: "center",
  marginTop: "1.58rem",
})

export const dialogDivider = style({
  width: "21rem",
  border: "none",
  borderTop: `${thickness.thin} solid ${colors.text}`,
  margin: 0,
})

export const translationOptionsHeading = style({
  fontFamily: `"Charis SIL", serif`,
  fontSize: "0.95rem",
  fontWeight: 700,
  textAlign: "left",
  margin: 0,
  marginTop: "1.32rem",
  paddingLeft: hspace.edge,
})

export const cherokeeDropdownWrapper = style({
  marginTop: "0.79rem",
})

export const dialogCheckboxList = style({
  display: "flex",
  flexDirection: "column",
  gap: vspace.medium,
  paddingLeft: hspace.edge,
  marginTop: "1.05rem",
})

export const documentInfoSection = style({
  display: "flex",
  flexDirection: "column",
  marginTop: "1.84rem",
})

export const documentInfoOptionsHeading = style({
  fontFamily: `"Charis SIL", serif`,
  fontSize: "0.95rem",
  fontWeight: 700,
  lineHeight: 1.2,
  textAlign: "left",
  margin: 0,
  paddingLeft: hspace.edge,
})

export const documentInfoOptionsSubtitle = style({
  fontFamily: `"Charis SIL", serif`,
  fontSize: "0.85rem",
  fontWeight: 400,
  lineHeight: 1.2,
  textAlign: "left",
  margin: 0,
  marginTop: vspace.quarter,
  paddingLeft: hspace.edge,
})

export const documentInfoCheckboxList = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  columnGap: hspace.edge,
  rowGap: vspace.medium,
  marginTop: vspace.medium,
  paddingLeft: hspace.edge,
  alignSelf: "stretch",
})

export const documentInfoCheckboxItem = style({
  display: "flex",
  alignItems: "center",
  gap: hspace.medium,
  fontFamily: `"Charis SIL", serif`,
  fontSize: "0.85rem",
  fontWeight: 400,
  lineHeight: 1.2,
  cursor: "pointer",
})

export const dialogButtonGroup = style({
  display: "flex",
  justifyContent: "center",
  gap: "2.6rem",
  marginTop: "1.84rem",
})

export const dialogCheckboxItem = style({
  display: "flex",
  alignItems: "center",
  gap: hspace.medium,
  fontSize: "0.75rem",
  cursor: "pointer",
})
