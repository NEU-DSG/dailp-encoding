import {
  StyleRule,
  createTheme,
  createThemeContract,
  style,
} from "@vanilla-extract/css"
import { darken, lighten, padding, rgba } from "polished"
import Typography from "typography"
import { rootFontSize } from "./constants"

export const typography = new Typography({
  baseFontSize: rootFontSize,
  baseLineHeight: 1.47,
  // headerFontFamily: theme.fonts.headerArr,
  // bodyFontFamily: theme.fonts.bodyArr,
  // bodyColor: theme.colors.text,
  // headerColor: theme.colors.headings,
})

export default createThemeContract({
  fontSizes: {
    root: rootFontSize,
  },
  colors: {
    primary: null,
    primaryContrast: null,
    primaryDark: null,
    primaryText: null,
    secondary: null,
    secondaryContrast: null,
    secondaryDark: null,
    secondaryText: null,
    body: null,
    bodyDark: null,
    text: null,
    link: null,
    headings: null,
    borders: null,
    focus: null,
  },
  fonts: {
    header: null,
    body: null,
    cherokee: null,
    smallCaps: null,
  },
})
