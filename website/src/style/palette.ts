// Add raw theme.css.ts and constants.ts values?

export const palette = {
  colors: {
    white: "#ffffff", // also "white"
    whiteAlpha65: "rgba(255, 255, 255, 0.65)",
    offWhite: "#fbf6ec",
    darkOffWhite: `darken(0.1, "#fbf6ec")`,

    black: "#000000", // also "#000000ff"
    darkCharcoal: "#333333",
    blackAlpha10: "rgba(0, 0, 0, 0.1)",
    blackAlpha20: "rgba(0, 0, 0, 0.2)",
    blackAlpha30: "rgba(0, 0, 0, 0.3)",

    boldGray: "#666666",
    chaliceGray: "#ADADAD",
    darkGray: "darkgray",
    lightGray: "lightgrey",
    marbleGray: "#e8e8e8ff",
    silverGrayAlpha65: "rgba(207, 205, 205, 0.65)",

    rockBlue: "#A4B3D1",
    cosmicNavyBlue: "#405372",
    newtonBlue: "#497CC7",
    dartFrogBlue: "#3867AD",
    grottoBlue: "#0771D4",
    zenBlue: "#6F85A9",
    seashellBlue: "#DFEFFE",
    lagoonBlue: "#4A90E2",
    solitudeBlue: "#e8f2ff",

    cocoaBrown: "#5C3A37",
    nutmegBrown: "#8D6660",
    blushBrown: "#AD7D77",

    lightZuriRed: `lighten(0.6, "#9d2832")`,
    darkZuriRed: `darken(0.2, "#9d2832")`,

    goldOrange: "#E6B469",
  },

  fontSizes: {
    small11: "11px",
    small12: "12px",
    small14: "14px",
    medium16: "16px",
    medium18: "18px",
    large20: "20px",
    large24: "24px",
    large28: "28px",

    // better names?
    rem07: "0.7rem",
    rem08: "0.8rem",
    rem0875: "0.875rem",
    rem09: "0.9rem",
    rem095: "0.95rem",
    rem11: "1.1rem",
    rem115: "1.15rem",
    rem125: "1.25rem",
    rem13: "1.3rem",
    rem5: "5rem",
  },

  fontWeights: {
    normal: "normal",
    medium: 500,
    semibold: 600,
    bold: 700, // also "bold"
  },

  fontFamilies: {
    inter: "'Inter', sans-serif",
    quattrocentoSans: `"Quattrocento Sans", "Segoe UI", "Arial", "sans-serif"`,
    charisSilDigohweli: `"Charis SIL", Digohweli, serif, Arial`,
    digohweliCharisSil: `Digohweli, "Charis SIL", "serif", "Arial"`,
    charisSil: "Charis SIL",
    philosopher: "Philosopher, sans-serif",
  },

  lineHeights: {
    /*
        1.6
        1.2
        lineHeight: "28px
        1.2
        1.47
        */
  },

  radii: {
    small4: "4px",
    medium8: "8px",
    large45: "45px",
    large999: "999px",

    rem025: "0.25rem",
  },

  borderWidths: {
    thin1: "1px",
    large10: "10px",
  },

  // Margin, padding, and gap
  spacing: {
    small2: "2px", // also "2"
    small3: "3px",
    small4: "4px",
    small5: "5px",
    small6: "6px", // also "6"
    small7: "7px",
    small8: "8px", // also "8"
    small10: "10px", // also "10"
    small12: "12px", // also "12"
    small15: "15px",
    small16: "16px", // also "16"
    small18: "18px", // also "18"
    medium20: "20px",
    medium24: "24px",
    medium30: "30px",
    medium32: "32px",
    medium35: "35px",
    large40: "40px",
    large48: "48px",
    large50: "50px",
    large60: "60px",
    large64: "64px",
    large80: "80px",
    large100: "100px",

    // better names
    rem025: "0.25rem",
    rem05: "0.5rem",
    rem075: "0.75rem",
    rem1: "1rem",
    rem15: "1.5rem",
    rem2: "2rem",
    rem3: "3rem",
    rem35: "3.5rem",
    rem4: "4rem",

    ch4: "4ch",
  },

  // grid, container widths
  width: {
    /*
        25%
        100%
        maxWidth: "1150px",
        min-width: 600px
        min-width: 900px
        200px
        maxWidth: "500px",
        max-width: 767px
        16rem
        350
        20rem
        40%
        800px
        4rem
        minWidth: "300px",
        140px
        width: "100vw",
        90%
        280px
        180px
        140px
        100vw
        250px
        300px
        16px
        180
        220
        130
        80%
        50%
        25rem
        900px
        20rem
        15.5rem
        90vw
        600px
        120px
        16px
        40%
        52em
        64em
        35rem
        95vw
        45rem
        600px
        601px
        900px
        901px
        */
  },

  // also do height?

  // better names?
  shadowScale: {
    twoByEight: "0 2px 8px",
    fourByEight: "0 4px 8px",
    fourByFour: "0 4px 4px",
    eightByThirtyTwo: "0 8px 32px",
  },

  transitionDurations: {
    fast: "150ms",
    medium: "500ms",
    slow: "800ms",
  },

  zIndices: {
    z1: 1,
    z10: 10,
    z1000: 1000,
  },
}
