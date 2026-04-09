import { globalStyle, style } from "@vanilla-extract/css"
import {
  annotationSection,
  documentBlock,
  inlineBlock,
  wordGroup,
  wordGroupInline,
} from "src/segment.css"
import {
  colors,
  fonts,
  hspace,
  mediaQueries,
  vspace,
} from "src/style/constants"

const printFonts = {
  quattrocento: `"Quattrocento", serif`,
}

const printFontSizes = {
  large: "1.1rem",
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

export const printMetaSection = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      marginTop: vspace.one,
    },
  },
})

export const printMetaField = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "flex",
      flexDirection: "row",
      paddingTop: vspace.quarter,
      paddingBottom: vspace.quarter,
      borderBottom: `1px solid #ADADAD`,
    },
  },
})

export const printMetaLabel = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      width: "160px",
      flexShrink: 0,
      fontFamily: fonts.header,
      fontSize: "10pt",
      fontWeight: 600,
      color: "#333333",
    },
  },
})

export const printMetaValue = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      fontFamily: "serif",
      fontSize: "10pt",
      fontWeight: 400,
      color: "#333333",
      lineHeight: 1.4,
    },
  },
})

export const printImageSource = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      fontFamily: "serif",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: 1.2,
      width: "636px",
      height: "17px",
      textAlign: "center",
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

export const printSectionHeading = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: `"Quattrocento", serif`,
      fontSize: "1.158rem",
      fontWeight: 700,
      lineHeight: 1.2,
      marginTop: vspace.one,
      marginBottom: 0,
      breakBefore: "avoid",
      breakAfter: "avoid",
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

export const printBodyContent = style({
  display: "none",
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      width: "100%",
      marginTop: 0,
      breakBefore: "avoid",
    },
  },
})

export const printHideParagraphTranslation = style({
  "@media": {
    [mediaQueries.print]: { display: "block" },
  },
})

globalStyle(`.${printHideParagraphTranslation} .${inlineBlock}`, {
  "@media": {
    [mediaQueries.print]: { display: "none" },
  },
})

export const printWordSpacing = globalStyle(
  `.${printBodyContent} .${wordGroup}, .${printBodyContent} .${wordGroupInline}`,
  {
    "@media": {
      [mediaQueries.print]: {
        display: "block",
        marginRight: 0,
        marginBottom: vspace.quarter,
        paddingTop: 0,
        paddingBottom: 0,
        breakInside: "avoid",
      },
    },
  }
)

globalStyle(
  `.${printBodyContent} .${annotationSection.story} .${wordGroupInline}`,
  {
    "@media": {
      [mediaQueries.print]: {
        display: "block",
        marginRight: 0,
        marginBottom: vspace.quarter,
      },
    },
  }
)

export const printDocumentBlockSpacing = globalStyle(
  `.${printBodyContent} .${documentBlock.story}, .${printBodyContent} .${documentBlock.wordByWord}`,
  {
    "@media": {
      [mediaQueries.print]: {
        marginTop: vspace.quarter,
        marginBottom: vspace.quarter,
        paddingBottom: 0,
        breakAfter: "avoid",
        breakBefore: "avoid",
      },
    },
  }
)

export const printAnnotationSectionSpacing = globalStyle(
  `.${printBodyContent} .${annotationSection.story}, .${printBodyContent} .${annotationSection.wordParts}`,
  {
    "@media": {
      [mediaQueries.print]: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 212px)",
        columnGap: vspace.one,
        rowGap: vspace.one,
        marginBottom: 0,
      },
    },
  }
)

export const printFirstDocumentBlockBorder = globalStyle(
  `.${printBodyContent} .${documentBlock.story}:first-child, .${printBodyContent} .${documentBlock.wordByWord}:first-child`,
  {
    "@media": {
      [mediaQueries.print]: {
        borderBottom: `1px solid ${colors.text}`,
      },
    },
  }
)

export const printParagraphPageBreak = globalStyle(
  `.${printBodyContent} .${wordGroup}:nth-child(3n+1):last-child, .${printBodyContent} .${wordGroupInline}:nth-child(3n+1):last-child`,
  {
    "@media": {
      [mediaQueries.print]: {
        breakAfter: "page",
      },
    },
  }
)

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
