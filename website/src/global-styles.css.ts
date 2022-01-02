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

globalStyle("*", { boxSizing: "border-box" })

// TODO Use a typed variable for this!
globalStyle(":root", {
  vars: {
    "--most-width": "95%",
  },
  "@media": {
    [mediaQueries.medium]: {
      vars: { "--most-width": "35rem" },
    },
    [mediaQueries.large]: {
      vars: { "--most-width": "45rem" },
    },
  },
})

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
  ...important({ backgroundColor: colors.footer }),
  "@media": {
    [mediaQueries.print]: important({
      backgroundColor: "none",
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
  borderRadius: 0,
  // selectors: {
  //   "&:hover": {
  //     textDecorationStyle: "solid",
  //   },
  //   "&:active, &:focus": {
  //     textDecoration: "none",
  //   },
  // },
  "@media": {
    [mediaQueries.print]: {
      color: "inherit",
      textDecoration: "none",
    },
  },
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

let t = typography.toJSON()
for (const selector in t) {
  globalStyle(selector, t[selector])
}

// These styles affect all pages.
// const globalStyles = css`
//   ${typography.toString()}
// `
