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
  story: palette.colors.lightBlue,
  suggestion: palette.colors.bisqueOrange,
  question: palette.colors.apostleGreen,
}

export const color = {
  actionPrimary: {
    base: palette.colors.cosmicNavyBlue,
    hover: palette.colors.zenBlue,
  },

  actionDanger: palette.colors.satinRed,
  actionNeutral: palette.colors.sharkGray,

  actionMetadataEdit: {
    base: palette.colors.newtonBlue,
    hover: palette.colors.dartFrogBlue,
  },

  link: palette.colors.lagoonBlue,

  border: {
    default: palette.colors.smoothGray,
    subtle: palette.colors.subtleWhite,
    strong: palette.colors.chaliceGray,
  },

  background: {
    surface: palette.colors.white,
    subtle: palette.colors.doctorGray,
    overlayLight: palette.colors.silverGrayAlpha65,
    overlayDark: palette.colors.blackAlpha20,
  },

  text: {
    primary: palette.colors.darkCharcoal,
    secondary: palette.colors.boldGray,
    muted: palette.colors.mediumGray,
  },

  status: {
    successText: palette.colors.retroGreen,
    successBg: palette.colors.honeydewGreen,
    errorText: palette.colors.berryRed,
    errorBg: palette.colors.blushPink,
  },

  tagNewBg: palette.colors.seashellBlue,
  tagNewText: palette.colors.grottoBlue,

  badge: {
    publishedBg: palette.colors.cosmicNavyBlue,
    hiddenBorder: palette.colors.smoothGray,
    hiddenText: palette.colors.boldGray,
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
  dropdown: `${palette.shadowScale["2y8b"]} ${palette.colors.blackAlpha10}`,
  modal: `${palette.shadowScale["8y32b"]} ${palette.colors.blackAlpha10}`,
  button: `${palette.shadowScale["4y4b"]} ${palette.colors.blackAlpha30}`,
  buttonHover: `${palette.shadowScale["4y8b"]} ${palette.colors.blackAlpha20}`,
  card: `${palette.shadowScale["8y16b"]} ${palette.colors.blackAlpha20}`,
  cardStrong: `${palette.shadowScale["8x8y4b"]} ${palette.colors.blackAlpha20}`,
  actionButton: `${palette.shadowScale["3y6b"]} ${palette.colors.blackAlpha30}`,
  actionButtonHover: `${palette.shadowScale["6y10b"]} ${palette.colors.blackAlpha40}`,
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
