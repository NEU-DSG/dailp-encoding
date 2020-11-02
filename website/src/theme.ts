const theme = {
  fonts: {
    // Noto Serif supports glottal stops and more accents than other fonts.
    body: `"Noto Serif", "Noto Sans Cherokee", "Arial", "serif"`,
    header: `"Quattrocento Sans"`,
    cherokee: "Noto Sans Cherokee",
  },
  fontSizes: {
    root: "18px",
  },
  colors: {
    header: "#f7eeed",
    footer: "rgb(63, 82, 113)",
    body: "white",
    text: "black",
    link: "#405372",
    headings: "#9f4c43",
    borders: "darkgray",
  },
  mediaQueries: {
    small: "@media print, (min-width: 40em)",
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
