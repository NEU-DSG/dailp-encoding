import Typography from "typography"
import { palette } from "./palette"
import { colors, fonts, rootFontSize } from "./theme-contract.css"

export { rootFontSize, fonts, colors }

export const typography = new Typography({
  baseFontSize: rootFontSize,
  baseLineHeight: palette.lineHeights.lh1_47,
  // headerFontFamily: theme.fonts.headerArr,
  // bodyFontFamily: theme.fonts.bodyArr,
  // bodyColor: theme.colors.text,
  // headerColor: theme.colors.headings,
})

export const rhythm = typography.rhythm

export const tagColors = {
  story: palette.colors.lightBlue,
  suggestion: palette.colors.bisqueOrange,
  question: palette.colors.apostleGreen,
}

export const radii = {
  none: palette.radii.none,
  small: palette.radii.px1,
  medium: palette.radii.px2,
  large: palette.radii.px4,
  round: palette.radii.px15,
}

export const thickness = {
  none: palette.borderWidths.none,
  thin: palette.borderWidths.px1,
  thick: palette.borderWidths.px2,
}

export const space = {
  [0]: 0,
  none: palette.spacing.none,
  xsmall: palette.spacing.px2,
  small: palette.spacing.px4,
  medium: palette.spacing.px8,
  large: palette.spacing.px16,
}

export const hspace = {
  ...space,
  halfEdge: palette.spacing.rem0_5,
  edge: palette.spacing.rem1,
  char: palette.spacing.ch1,
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
  full: palette.width.pct100,
  auto: "auto", // should this be part of the palette?
}

export const hsize = {
  [0]: 0,
  none: palette.width.none,
  full: palette.width.pct100,
  xsmall: palette.width.rem6,
  small: palette.width.rem20,
  medium: palette.width.rem41,
  large: palette.width.rem50,
  auto: "auto",
  edge: hspace.edge,
}

export const mediaQueries = {
  any: undefined,
  medium: `screen and (min-width: ${palette.width.em52})`,
  large: `screen and (min-width: ${palette.width.em64})`,
  print: "print",
}

export const selectors = {
  currentPage: "&[aria-current='page']",
}

export const buttonSize = {
  small: palette.width.rem4_5,
}

export const fontSize = {
  tiny: palette.fontSizes.rem0_8,
  small: palette.fontSizes.rem0_9,
}

export const layers = {
  top: palette.zIndices.z999,
  third: palette.zIndices.z3,
  second: palette.zIndices.z2,
  base: palette.zIndices.z1,
}
