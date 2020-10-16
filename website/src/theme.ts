import "typeface-gentium-basic"
import "typeface-open-sans"

const theme = {
  fonts: {
    body: `"Gentium Plus", "Gentium Basic", "Noto Sans Cherokee",
        "Arial", "serif"`,
    header: `"Open Sans"`,
  },
  fontSizes: {
    root: "18px",
  },
  colors: {
    header: "#f7eeed",
    footer: "rgb(63, 82, 113)",
    body: "white",
    text: "black",
    headings: "#bb675d",
  },
  mediaQueries: {
    small: "@media (min-width: 40em)",
    medium: "@media print, (min-width: 52em)",
    large: "@media (min-width: 64em)",
  },
  edgeSpacing: "1rem",
}

export const fullWidth = {
  width: "100%",
  [theme.mediaQueries.medium]: {
    width: "45rem",
  },
  [theme.mediaQueries.large]: {
    width: "56rem",
  },
}

export const largeDialog = {
  width: "95%",
  [theme.mediaQueries.medium]: {
    width: "35rem",
  },
  [theme.mediaQueries.large]: {
    width: "45rem",
  },
}

export default theme
