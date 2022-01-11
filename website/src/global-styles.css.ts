import { globalStyle } from "@vanilla-extract/css"
import { important } from "polished"
import {
  colors,
  mediaQueries,
  rootFontSize,
  theme,
  vspace,
} from "./sprinkles.css"
import { paddingY } from "./style-utils"
import { typography } from "./theme"

const t = typography.toJSON()
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
  fontFamily: theme.fonts.body,
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

globalStyle("a", {
  color: colors.link,
  textDecorationThickness: "0.08em",
  textDecorationSkipInk: "none",
  textDecorationStyle: "dotted",
  borderRadius: 0,
  outlineColor: colors.link,
  "@media": {
    [mediaQueries.print]: {
      color: "inherit",
      textDecoration: "none",
    },
  },
})

globalStyle("a:hover", {
  textDecorationStyle: "solid",
})

globalStyle("a:active, a:focus", {
  textDecoration: "none",
})

globalStyle("button:focus, a:focus, img:focus, *[tabindex]:focus", {
  outline: `thin solid ${colors.link}`,
  outlineOffset: 0,
  "@media": {
    [mediaQueries.print]: {
      outline: "none",
    },
  },
})

globalStyle("main", {
  backgroundColor: colors.body,
  display: "flex",
  flexFlow: "column wrap",
  alignItems: "center",
  ...paddingY(vspace.one),
  "@media": {
    [mediaQueries.print]: {
      display: "block",
      paddingBottom: 0,
    },
  },
})

globalStyle("h1, h2, h3, h4, h5, h6, header", {
  color: colors.headings,
  fontFamily: theme.fonts.header,
  "@media": {
    [mediaQueries.print]: {
      color: "black",
    },
  },
})

globalStyle("hr", {
  width: "40%",
  margin: "auto",
})

globalStyle(`button, input[type="radio"]`, {
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "inherit",
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
  marginLeft: vspace.one,
})

globalStyle("textarea", {
  maxWidth: "100%",
})
