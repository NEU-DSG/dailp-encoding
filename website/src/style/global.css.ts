import { globalStyle } from "@vanilla-extract/css"
import { important } from "polished"
import {
  colors,
  fonts,
  mediaQueries,
  rhythm,
  rootFontSize,
  thickness,
  typography,
} from "src/style/constants"
import { paddingY } from "src/style/utils"

const t: Record<string, any> = typography.toJSON()
for (const selector in t) {
  globalStyle(selector, t[selector])
}

globalStyle("*", { boxSizing: "border-box" })

globalStyle("html", {
  margin: 0,
  padding: 0,
  overflow: "initial",
  ...important({ fontSize: rootFontSize }),
  "@media": {
    [mediaQueries.print]: important({
      fontSize: "11.5pt",
    }),
  },
})

globalStyle("body", {
  margin: 0,
  padding: 0,
  fontFamily: fonts.body,
  backgroundColor: colors.body,
  "@media": {
    [mediaQueries.print]: important({
      color: "black",
    }),
  },
})

globalStyle("abbr[title]", {
  "@media": {
    [mediaQueries.print]: {
      borderBottom: "none",
      textDecoration: "none",
    },
  },
})

globalStyle("p, h1, h2", {
  pageBreakInside: "avoid",
  breakInside: "avoid",
})

globalStyle("@page", {
  margin: "0.75in",
})

globalStyle("@page :left :header", {
  content: "first(title)",
})

globalStyle("@page :right :header", {
  content: "first(chapter), , decimal(pageno)",
})

globalStyle("*:focus", {
  ...important({
    outline: `${thickness.thick} solid ${colors.focus}`,
  }),
  outlineOffset: 0,
  "@media": {
    [mediaQueries.print]: {
      outline: "none",
    },
  },
})

globalStyle(
  "*:focus:not(:focus-visible)",
  important({
    outline: "none",
  })
)

globalStyle("main", {
  display: "flex",
  flexFlow: "column wrap",
  alignItems: "center",
  ...paddingY(rhythm(1)),
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      paddingBottom: 0,
    },
  },
})

globalStyle("h1, h2, h3, h4, h5, h6, header", {
  color: colors.headings,
  fontFamily: fonts.header,
  "@media": {
    [mediaQueries.print]: {
      color: "black",
    },
  },
})

globalStyle("label", {
  fontWeight: "bold",
})

globalStyle("hr", {
  width: "40%",
  margin: "auto",
  "@media": {
    [mediaQueries.print]: {
      display: "none",
    },
  },
})

globalStyle(`button, input[type="radio"]`, {
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "inherit",
  "@media": {
    [mediaQueries.print]: {
      display: "none",
    },
  },
})

globalStyle("table", {
  maxWidth: "100%",
})

globalStyle("figure", {
  marginInlineStart: 0,
  maxWidth: "100%",
  "@media": {
    [mediaQueries.medium]: {
      marginInlineStart: "2rem",
    },
  },
})

globalStyle("dd", {
  marginLeft: rhythm(1),
})

globalStyle("textarea", {
  maxWidth: "100%",
  "@media": {
    [mediaQueries.print]: {
      resize: "none",
      border: `${thickness.thin} solid ${colors.text}`,
    },
  },
})

globalStyle("img", {
  maxWidth: "initial",
})

globalStyle("input", {
  "@media": {
    [mediaQueries.print]: {
      border: "none",
      borderBottom: `${thickness.thin} solid ${colors.text}`,
    },
  },
})

