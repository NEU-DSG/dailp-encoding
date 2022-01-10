import { createTheme, createVar, style } from "@vanilla-extract/css"
import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles"
import { paddingX } from "src/style-utils"

function rhythm(v: number): string {
  const size = v * 1.49
  return `${size}rem`
}

export const rootFontSize = "19px"

export const [themeClass, theme] = createTheme({
  fontSizes: {
    root: rootFontSize,
  },
  colors: {
    header: "#f7eeed",
    button: "#f7eeed",
    footer: "#405372",
    altFooter: "#4f5970",
    body: "white",
    text: "hsl(0, 0%, 0%, 0.95)",
    link: "#405372",
    headings: "#9f4c43",
    borders: "darkgray",
  },
  fonts: {
    header: `"Quattrocento Sans", "Segoe UI", "Arial", "sans-serif"`,
    body: `"Charis SIL", Digohweli, serif, Arial`,
    cherokee: `Digohweli, "Charis SIL", "serif", "Arial"`,
    smallCaps: "Charis SIL",
  },
})

export const colors = {
  ...theme.colors,
  transparent: "transparent",
  inherit: "inherit",
}

const radii = {
  none: 0,
  small: "1px",
  medium: "2px",
}

const thickness = {
  none: 0,
  thin: "1px",
  thick: "2px",
}

const space = {
  [0]: 0,
  none: 0,
  small: "4px",
  medium: "8px",
  large: "16px",
  // etc.
}

export const hspace = {
  ...space,
  halfEdge: "0.5rem",
  edge: "1rem",
  char: "1ch",
}

export const vspace = {
  ...space,
  quarter: rhythm(1 / 4),
  half: rhythm(1 / 2),
  one: rhythm(1),
  [1.5]: rhythm(1.5),
  [1.75]: rhythm(1.75),
  double: rhythm(2),
}

const vsize = {
  [0]: 0,
  quarter: rhythm(1 / 4),
  half: rhythm(1 / 2),
  one: rhythm(1),
  full: "100%",
  auto: "auto",
}

const hsize = {
  [0]: 0,
  none: 0,
  full: "100%",
  medium: "41rem",
  large: "50rem",
  auto: "auto",
  edge: hspace.edge,
}

export const mediaQueries = {
  any: undefined,
  medium: "screen and (min-width: 52em)",
  large: "screen and (min-width: 64em)",
  print: "print",
}

const responsive = defineProperties({
  properties: {
    position: ["relative", "absolute", "fixed"],
    display: ["none", "flex", "block", "inline", "inline-block", "initial"],
    cursor: ["pointer"],
    top: vspace,
    bottom: vspace,
    left: hspace,
    right: hspace,
    paddingTop: vspace,
    paddingBottom: vspace,
    paddingLeft: hspace,
    paddingRight: hspace,
    marginTop: vspace,
    marginBottom: vspace,
    marginLeft: hspace,
    marginRight: hspace,
    width: hsize,
    minWidth: hsize,
    height: vsize,
    minHeight: vsize,
    outlineStyle: ["solid", "dashed"],
    borderStyle: ["solid", "dashed"],
    borderWidth: thickness,
    outlineWidth: thickness,
    borderRadius: radii,
    fill: colors,
    borderColor: colors,
    outlineColor: colors,
    backgroundColor: colors,
    color: colors,
    fontFamily: theme.fonts,
    lineHeight: vspace,
  },
  shorthands: {
    padding: ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"],
    paddingX: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
    marginX: ["marginLeft", "marginRight"],
    marginY: ["marginTop", "marginBottom"],
    inset: ["top", "bottom", "left", "right"],
  },
  conditions: {
    any: {},
    medium: { "@media": "screen and (min-width: 52em)" },
    large: { "@media": "screen and (min-width: 64em)" },
    print: { "@media": "print" },
    hover: { selector: "&:hover" },
    focus: { selector: "&:focus" },
    active: { selector: "&:active" },
    selected: { selector: "&:hover, &:focus, &:active" },
    currentPage: { selector: "&[aria-current='page']" },
  },
  defaultCondition: "any",
  responsiveArray: ["any", "medium", "large"],
})

const sprinkles = createSprinkles(responsive)

export default sprinkles

export const hideOnPrint = sprinkles({
  display: { print: "none" },
})

export const withBg = style([
  hideOnPrint,
  sprinkles({
    backgroundColor: "body",
    paddingY: "quarter",
    paddingX: "char",
    borderColor: "text",
    borderWidth: "thin",
  }),
  {
    zIndex: 999,
    "@media": {
      [mediaQueries.medium]: {
        maxWidth: "70vw",
      },
    },
  },
])

const tooltip = style([
  withBg,
  {
    fontFamily: theme.fonts.body,
    color: theme.colors.text,
    fontSize: "0.9rem",
    right: "auto",
  },
])

export const fullWidth = sprinkles({
  width: {
    any: "full",
    medium: "medium",
    large: "large",
  },
})

export const paragraph = style({
  marginBottom: vspace.one,
})

export const closeBlock = style({
  marginBottom: vspace.half,
})

export const edgePadded = style(paddingX(hspace.edge))

export const wrappedRow = style({
  display: "flex",
  flexFlow: "row wrap",
})

export const row = style({
  display: "flex",
  flexFlow: "row nowrap",
})

export const column = style({
  display: "flex",
  flexFlow: "column nowrap",
})

export const centeredColumn = style({
  display: "flex",
  flexFlow: "column nowrap",
  alignItems: "center",
})

export const wrappedColumn = style({
  display: "flex",
  flexFlow: "column wrap",
})

const smallCaps = style([
  sprinkles({ fontFamily: "smallCaps" }),
  {
    fontFeatureSettings: `"smcp"`,
    textTransform: "lowercase",
  },
])

export const std = {
  tooltip,
  fullWidth,
  smallCaps,
}

export const paddedWidth = style(paddingX(hspace.edge))

export const largeDialog = style({
  width: "95%",
  "@media": {
    [mediaQueries.medium]: {
      width: "35rem",
    },
    [mediaQueries.large]: {
      width: "45rem",
    },
  },
})

export const button = style([
  sprinkles({
    fontFamily: "header",
    color: { any: "link", hover: "headings" },
    // background-color: ${Color(theme.colors.button).lighten(0.2).hsl().string()};
    backgroundColor: { any: "button", hover: "button" },
    paddingX: "char",
    paddingY: "quarter",
    marginX: "edge",
    cursor: "pointer",
    borderWidth: "thick",
    borderColor: "headings",
    borderStyle: "solid",
  }),
  {
    selectors: {
      "&:focus, &:active": {
        outline: "none",
        borderStyle: "dashed",
      },
      "&[disabled]": {
        color: "darkgray",
        backgroundColor: "lightgray",
        borderColor: "darkgray",
        opacity: 80,
      },
    },
  },
])

export const iconButton = style([
  button,
  sprinkles({
    padding: "large",
  }),
  {
    border: "none",
    margin: 0,
  },
])

export const paddedCenterColumn = style([edgePadded, centeredColumn])
