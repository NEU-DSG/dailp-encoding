const theme = {
  fonts: {
    // Noto Serif supports glottal stops and more accents than other fonts.
    body: `"Noto Serif", "Noto Sans Cherokee", Arial, serif`,
    bodyArr: ["Noto Serif", "Noto Sans Cherokee", "Arial", "serif"],
    header: `"Quattrocento Sans", "Segoe UI", Arial, sans-serif`,
    headerArr: ["Quattrocento Sans", "Segoe UI", "Arial", "sans-serif"],
    cherokee: `"Noto Sans Cherokee", "Noto Sans", Arial, sans-serif`,
  },
  fontSizes: {
    root: "18px",
  },
  colors: {
    header: "#f7eeed",
    footer: "#405372",
    altFooter: "#4f5970",
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
  rhythm: 1.53,
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
