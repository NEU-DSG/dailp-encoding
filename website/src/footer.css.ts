import { style } from "@vanilla-extract/css"
import sprinkles, { colors, hideOnPrint, std, theme } from "src/sprinkles.css"

export const darkTheme = style([
  hideOnPrint,
  {
    vars: {
      [theme.colors.link]: "white",
    },
  },
])

export const container = style([
  sprinkles({
    fontFamily: "header",
    paddingY: "one",
    paddingX: "edge",
    color: "body",
    backgroundColor: "footer",
  }),
  {
    fontSize: "0.9rem",
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
  },
])

export const image = sprinkles({ marginBottom: 0 })

export const content = style([
  std.fullWidth,
  {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-between",
  },
])

export const light = style([
  container,
  {
    backgroundColor: colors.body,
    color: colors.text,
    justifyContent: "space-evenly",
  },
])
