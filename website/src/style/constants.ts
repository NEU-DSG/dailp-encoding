import Typography from "typography"
import { colors, fonts, rootFontSize } from "./theme-contract.css"

export { rootFontSize, fonts, colors }

export const typography = new Typography({
  baseFontSize: rootFontSize,
  baseLineHeight: 1.47,
  // headerFontFamily: theme.fonts.headerArr,
  // bodyFontFamily: theme.fonts.bodyArr,
  // bodyColor: theme.colors.text,
  // headerColor: theme.colors.headings,
})

export const rhythm = typography.rhythm

export const tagColors = {
  story: "#C3E0EE",
  suggestion: "#F0D6C1",
  question: "#C3EEDE",
}

export const radii = {
  none: 0,
  small: "1px",
  medium: "2px",
  large: "4px",
  round: "15px",
}

export const thickness = {
  none: 0,
  thin: "1px",
  thick: "2px",
}

export const space = {
  [0]: 0,
  none: 0,
  xsmall: "2px",
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
  eighth: rhythm(1 / 8),
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

export const hsize = {
  [0]: 0,
  none: 0,
  full: "100%",
  xsmall: "6rem",
  small: "20rem",
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

export const selectors = {
  currentPage: "&[aria-current='page']",
}

export const buttonSize = {
  small: "4.5rem",
}

export const fontSize = {
  tiny: "0.8rem",
  small: "0.9rem",
}

export const layers = {
  top: 999,
  third: 3,
  second: 2,
  base: 1,
}
