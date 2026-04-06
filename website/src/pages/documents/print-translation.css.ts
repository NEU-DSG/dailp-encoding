import { globalStyle, style } from "@vanilla-extract/css"
import {
  annotationSection,
  documentBlock,
  inlineBlock,
  wordGroup,
  wordGroupInline,
} from "src/segment.css"
import { colors, fonts, mediaQueries, vspace } from "src/style/constants"

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
        fontSize: "18pt",
        fontWeight: 700,
        lineHeight: 1.2,
        width: "212px",
        height: "40px",
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
        fontSize: "16pt",
        fontWeight: 400,
        lineHeight: 1.2,
        width: "212px",
        height: "40px",
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
        fontSize: "16pt",
        fontStyle: "italic",
        fontWeight: 400,
        lineHeight: 1.2,
        width: "212px",
        height: "40px",
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
        fontSize: "15pt",
        fontWeight: 400,
        textTransform: "lowercase",
        lineHeight: 1.2,
        width: "212px",
        height: "40px",
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
        fontSize: "16pt",
        fontWeight: 400,
        lineHeight: 1.2,
        width: "212px",
        height: "40px",
      },
    },
  }
)
