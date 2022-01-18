import { globalStyle, style } from "@vanilla-extract/css"
import sprinkles, { theme } from "src/sprinkles.css"

export const wide = sprinkles({ width: "full" })

export const container = style([
  sprinkles({
    height: "quarter",
    borderRadius: "medium",
    marginX: "halfEdge",
    marginY: "half",
  }),
  {
    display: "inline-block",
    width: "75% !important",
    background: "#a9a9a9",
  },
])

export const fill = style([
  sprinkles({
    height: "full",
  }),
  {
    background: "#444444",
    borderRadius: "inherit",
    textAlign: "right",
  },
])

export const audioElement = style([
  sprinkles({
    display: "inline",
    marginLeft: "halfEdge",
    cursor: "pointer",
    width: "full",
  }),
  {
    textAlign: "center",
  },
])

globalStyle(`${audioElement} svg`, {
  fill: theme.colors.link,
})

// export const timestamp = css`
//   //margin-left: 0.4rem;
//   //cursor: pointer;
//   display: inline;
//   text-align: center;
//   //width: 100% !important;
//   text-color: ${theme.colors.link};
//   }
// `
