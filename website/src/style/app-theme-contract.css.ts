import { createThemeContract } from "@vanilla-extract/css"

export const rootFontSize = "19px"

export const themeContract = createThemeContract({
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

export const fonts = themeContract.fonts

export const colors = themeContract.colors
