import Typography from "typography"
import { palette } from "./palette"
import { colors, fonts, rootFontSize } from "./theme-contract.css"

export { rootFontSize, fonts, colors }

export const typography = new Typography({
  baseFontSize: rootFontSize,
  baseLineHeight: palette.lineHeights.lh1_47,
})

export const rhythm = typography.rhythm

export const tagColors = {
  story: palette.colors.hexC3E0EE,
  suggestion: palette.colors.hexF0D6C1,
  question: palette.colors.hexC3EEDE,
}

export const color = {
  actionPrimary: {
    base: palette.colors.hex405372,
    hover: palette.colors.hex6F85A9,
  },

  actionDanger: palette.colors.hexB72D3B,
  actionNeutral: palette.colors.hex6C757D,

  actionMetadataEdit: {
    base: palette.colors.hex497CC7,
    hover: palette.colors.hex3867AD,
  },

  link: palette.colors.hex4A90E2,

  border: {
    default: palette.colors.hexCCCCCC,
    subtle: palette.colors.hexEEEEEE,
    strong: palette.colors.hexADADAD,
  },

  background: {
    surface: palette.colors.hexFFFFFF,
    subtle: palette.colors.hexF9F9F9,
    overlayLight: palette.colors.hexCFCDCD_alpha65,
    overlayDark: palette.colors.hex000000_alpha20,
  },

  text: {
    primary: palette.colors.hex333333,
    secondary: palette.colors.hex666666,
    muted: palette.colors.hexAAAAAA,
  },

  status: {
    successText: palette.colors.hex28A745,
    successBg: palette.colors.hexF0FFF4,
    errorText: palette.colors.hexB00020,
    errorBg: palette.colors.hexFFEBEE,
  },

  tagNewBg: palette.colors.hexDFEFFE,
  tagNewText: palette.colors.hex0771D4,

  badge: {
    publishedBg: palette.colors.hex405372,
    hiddenBorder: palette.colors.hexCCCCCC,
    hiddenText: palette.colors.hex666666,
  },
}

export const fontWeight = {
  body: palette.fontWeights.normal,
  label: palette.fontWeights.medium,
  emphasis: palette.fontWeights.semibold,
  strong: palette.fontWeights.bold,
}

export const lineHeight = {
  tight: palette.lineHeights.lh1_2,
  body: palette.lineHeights.lh1_5,
  loose: palette.lineHeights.lh1_6,
}

export const letterSpacing = {
  upperCaseLabel: palette.spacing.px0_5,
  badge: palette.letterSpacing.ls0_5,
}

export const borderStyle = {
  decorative: palette.borderStyle.ridge,
}

export const shadow = {
  dropdown: `${palette.shadowScale["2y8b"]} ${palette.colors.hex000000_alpha10}`,
  modal: `${palette.shadowScale["8y32b"]} ${palette.colors.hex000000_alpha10}`,
  button: `${palette.shadowScale["4y4b"]} ${palette.colors.hex000000_alpha30}`,
  buttonHover: `${palette.shadowScale["4y8b"]} ${palette.colors.hex000000_alpha20}`,
  card: `${palette.shadowScale["8y16b"]} ${palette.colors.hex000000_alpha20}`,
  cardStrong: `${palette.shadowScale["8x8y4b"]} ${palette.colors.hex000000_alpha20}`,
  actionButton: `${palette.shadowScale["3y6b"]} ${palette.colors.hex000000_alpha30}`,
  actionButtonHover: `${palette.shadowScale["6y10b"]} ${palette.colors.hex000000_alpha40}`,
}

export const transition = {
  backdrop: `${palette.transitionDurations.t100} ${palette.transitionEasings.easeInOut}`,
  panel: `${palette.transitionDurations.t150} ${palette.transitionEasings.easeInOut}`,
  hover: `${palette.transitionDurations.t200} ${palette.transitionEasings.ease}`,
  drawer: `${palette.transitionDurations.t250} ${palette.transitionEasings.ease}`,
  dropdownIcon: `${palette.transitionDurations.t300} ${palette.transitionEasings.ease}`,
  scrollIndicatorShow: `${palette.transitionDurations.t500} ${palette.transitionEasings.ease}`,
  scrollIndicatorHide: `${palette.transitionDurations.t800} ${palette.transitionEasings.ease}`,
}

export const zIndexRole = {
  dropdown: palette.zIndices.z10,
  modalOverlay: palette.zIndices.z1000,
}

export const opacityRole = {
  hidden: palette.opacity.none,
  visible: palette.opacity.o1,
  hoverFade: palette.opacity.o0_8,
}

export const transformRole = {
  hoverLift: palette.transform.translateYNeg3px,
  hoverGrowSm: palette.transform.scale1_02,
  hoverGrowMd: palette.transform.scale1_03,
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
  title: palette.fontSizes.px24,
  titleLarge: palette.fontSizes.px28,
  label: palette.fontSizes.px16,
  body: palette.fontSizes.px14,
  caption: palette.fontSizes.px12,
  icon: palette.fontSizes.px20,

  tiny: palette.fontSizes.rem0_8,
  small: palette.fontSizes.rem0_9,
}

export const layers = {
  top: palette.zIndices.z999,
  third: palette.zIndices.z3,
  second: palette.zIndices.z2,
  base: palette.zIndices.z1,
}
