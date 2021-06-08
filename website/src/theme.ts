import { css } from "@emotion/react"
import styled from "@emotion/styled"
import Color from "color"
import Typography from "typography"
import CSS from "csstype"
import { Button as BaseButton } from "reakit/Button"

const theme = {
  fonts: {
    // 4 fonts total: header + sans body, serif body, serif smallcaps, Cherokee.
    // Noto Serif supports glottal stops and more accents than other fonts.
    bodyArr: ["Charis SIL", "Digohweli", "serif", "Arial"],
    headerArr: ["Quattrocento Sans", "Segoe UI", "Arial", "sans-serif"],
    cherokee: `"Digohweli", "Spectral", "serif", "Arial"`,
    smallCaps: "Charis SIL",
    body: null,
    header: null,
  },
  fontSizes: {
    root: "19px",
  },
  colors: {
    header: "#f7eeed",
    button: "#f7eeed",
    footer: "#405372",
    altFooter: "#4f5970",
    body: "white",
    text: "black",
    link: "#405372",
    headings: "#9f4c43",
    borders: "darkgray",
  },
  mediaQueries: {
    small: "@media screen and (min-width: 40em)",
    medium: "@media screen and (min-width: 52em)",
    large: "@media screen and (min-width: 64em)",
    print: "@media print",
  },
  edgeSpacing: "1rem",
}

export const wordpressUrl = "https://wp.dailp.northeastern.edu"

theme.fonts.body = theme.fonts.bodyArr.join(",")
theme.fonts.header = theme.fonts.headerArr.join(",")

export interface CSSProps extends CSS.Properties {
  // Add fallback objects to support arbitrary nested selectors
  // [k: string]: CSSProps
}

export const typography = new Typography({
  baseFontSize: theme.fontSizes.root,
  baseLineHeight: 1.47,
  headerFontFamily: theme.fonts.headerArr,
  bodyFontFamily: theme.fonts.bodyArr,
  bodyColor: "hsl(0, 0%, 0%, 0.95)",
  headerColor: "hsl(0, 0%, 0%, 0.9)",
})

const paddingX = (x) => css({ paddingLeft: x, paddingRight: x })

export const centered = paddingX(theme.edgeSpacing)

export const fullWidth = css(centered, {
  width: "100%",
  [theme.mediaQueries.medium]: {
    width: "41rem",
  },
  [theme.mediaQueries.large]: {
    width: "50rem",
  },
})

export const largeDialog = css({
  width: "var(--most-width)",
})

export const withBg = css`
  z-index: 999;
  background-color: ${theme.colors.body};
  padding: ${typography.rhythm(1 / 6)} 1ch;
  border: 1px solid ${theme.colors.text};
  ${theme.mediaQueries.medium} {
    max-width: 70vw;
  }
  ${theme.mediaQueries.print} {
    display: none;
  }
`

export const hideOnPrint = css`
  ${theme.mediaQueries.print} {
    display: none;
  }
`

export const Button = styled(BaseButton)`
  font-family: ${theme.fonts.header};
  color: ${theme.colors.link};
  background-color: ${theme.colors.button};
  padding: ${typography.rhythm(1 / 3)} 1ch;
  margin: 0 1rem;
  cursor: pointer;
  border: 2px solid ${theme.colors.headings};
  &:hover {
    color: ${theme.colors.headings};
    background-color: ${Color(theme.colors.button).lighten(0.2).hsl().string()};
  }
  &:focus,
  &:active {
    outline: none;
    border-style: dashed;
  }

  &[disabled] {
    color: darkgray;
    background-color: lightgray;
    border-color: darkgray;
    opacity: 80;
  }
`

const iconButton = css`
  border: none;
  margin: 0;
  padding: 8px;
  & > svg {
    display: block;
  }
`

const smallCaps = css`
  font-family: ${theme.fonts.smallCaps};
  font-feature-settings: "smcp";
  text-transform: lowercase;
`

const closeBlock = css`
  margin-bottom: ${typography.rhythm(0.5)};
`

export const std = {
  iconButton,
  smallCaps,
  tooltip: withBg,
  closeBlock,
}

export default theme
