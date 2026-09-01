// palette.ts
import { darken, lighten, rgba } from "polished"

export const palette = {
  colors: {
    // Transparent
    transparent: "transparent",

    // White
    white: "#ffffff", // also "white" and "#ffffffff"
    whiteAlpha25: rgba(255, 255, 255, 0.2),
    whiteAlpha65: rgba(255, 255, 255, 0.65),
    offWhite: "#fbf6ec",
    darkOffWhite: darken(0.1, "#fbf6ec"),
    subtleWhite: "#eee",
    luxuryWhite: "#fafafa",

    // Black
    black: "#000000", // also "#000000ff"
    darkCharcoal: "#333333", // also #333
    blackAlpha10: rgba(0, 0, 0, 0.1),
    blackAlpha15: rgba("black", 0.15),
    blackAlpha25: rgba(0, 0, 0, 0.25),
    blackAlpha20: rgba(0, 0, 0, 0.2),
    blackAlpha30: rgba(0, 0, 0, 0.3),
    blackAlpha40: rgba(0, 0, 0, 0.4),
    blackAlpha95: rgba("black", 0.95),
    clayBlack: "#222d3d",

    // Gray
    gray: "#808080", // appears as "gray" and "grey"
    boldGray: "#666666", // also "#666"
    chaliceGray: "#ADADAD",
    darkGray: "darkgray", // also "#a9a9a9"
    lightGray: "lightgray", // also "lightgrey"
    marbleGray: "#e8e8e8ff",
    smoothGray: "#ccc",
    silverGrayAlpha65: rgba(207, 205, 205, 0.65),
    offWhiteGray: "#f0f0f0",
    offWhiteGrayAlpha90: rgba(240, 240, 240, 0.9),
    brightGray: "#ECECEC",
    mediumGray: "#aaa",
    atomicGray: "#555",
    lightSilverGray: "#e0e0e0",
    doctorGray: "#f9f9f9",
    gainsboroGray: "#ddd",
    superGray: "#999",
    sharkGray: "#6c757d",
    brownGray: "#585858",
    graphiteGray: "#444444",
    colorlessGray: "#d7d7d7ff",

    // Blue
    rockBlue: "#A4B3D1",
    cosmicNavyBlue: "#405372",
    newtonBlue: "#497CC7",
    dartFrogBlue: "#3867AD",
    grottoBlue: "#0771D4",
    zenBlue: "#6F85A9",
    seashellBlue: "#DFEFFE",
    lagoonBlue: "#4A90E2",
    solitudeBlue: "#e8f2ff",
    crystalBlue: "#c6ddff",
    lightBlue: "#C3E0EE",

    // Brown
    cocoaBrown: "#5C3A37",
    nutmegBrown: "#8D6660",
    blushBrown: "#AD7D77",
    redBrown: "#823E2D",

    // Red
    red: "red",
    lightZuriRed: lighten(0.6, "#9d2832"),
    darkZuriRed: darken(0.2, "#9d2832"),
    satinRed: "#b72d3b",
    berryRed: "#b00020",
    maroonRed: "maroon",

    // Orange
    goldOrange: "#E6B469",
    lightPeachAlpha80: rgba(247, 238, 237, 0.8),
    bisqueOrange: "#F0D6C1",

    // Green
    retroGreen: "#28a745",
    honeydewGreen: "#f0fff4",
    apostleGreen: "#C3EEDE",

    // Pink
    blushPink: "#ffebee",
  },

  fontSizes: {
    // Px
    px10: "10px", // also 10
    px11: "11px", // also 11
    px12: "12px", // also 12
    px14: "14px", // also 14
    px16: "16px",
    px18: "18px",
    px20: "20px",
    px24: "24px",
    px28: "28px",

    // Rem
    rem0_7: "0.7rem",
    rem0_8: "0.8rem",
    rem0_875: "0.875rem",
    rem0_9: "0.9rem",
    rem0_95: "0.95rem",
    rem1: "1rem",
    rem1_1: "1.1rem",
    rem1_15: "1.15rem",
    rem1_25: "1.25rem",
    rem1_3: "1.3rem",
    rem1_6: "1.6rem",
    rem5: "5rem",

    // Em
    em0_8: "0.8em",

    // Pt
    pt11_5: "11.5pt",

    // Relative
    larger: "larger",
  },

  fontWeights: {
    normal: "normal",
    medium: "500",
    semibold: "600", // also 600
    bold: "700", // also "bold"
    bolder: "bolder",
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
    none: 0,

    // Unitless
    lh1: 1,
    lh1_2: 1.2,
    lh1_47: 1.47,
    lh1_5: 1.5,
    lh1_6: 1.6,

    // Px
    px28: "28px",
  },

  radii: {
    none: 0,

    // Px
    px1: "1px",
    px2: "2px",
    px4: "4px",
    px8: "8px", // also 8
    px15: "15px",
    px45: "45px",
    px999: "999px",

    // Rem
    rem0_25: "0.25rem",

    // Percent
    pct50: "50%",
  },

  borderWidths: {
    none: 0,

    px1: "1px",
    px2: "2px",
    px4: "4px",
    px10: "10px",
  },

  borderStyle: {
    ridge: "ridge",
  },

  // Margin, padding, and gap
  spacing: {
    none: 0, // also "0em"

    // Px
    px0_5: "0.5px",
    px2: "2px", // also 2
    px3: "3px",
    px4: "4px",
    px5: "5px",
    px6: "6px", // also 6
    px7: "7px",
    px8: "8px", // also 8
    px10: "10px", // also 10
    px12: "12px", // also 12
    px15: "15px",
    px16: "16px", // also 16
    px18: "18px", // also 18
    px20: "20px",
    px24: "24px",
    px30: "30px",
    px32: "32px",
    px35: "35px",
    px40: "40px",
    px48: "48px",
    px50: "50px",
    px56: "56px",
    px60: "60px",
    px64: "64px",
    px80: "80px",
    px100: "100px",

    // Rem
    remNeg5: "-5rem",
    rem0_25: "0.25rem",
    rem0_3: "0.3rem",
    rem0_5: "0.5rem",
    rem0_75: "0.75rem",
    rem1: "1rem",
    rem1_5: "1.5rem",
    rem2: "2rem",
    rem2_5: "2.5rem",
    rem3: "3rem",
    rem3_5: "3.5rem",
    rem4: "4rem",
    rem10: "10rem",

    // Em
    em0_75: "0.75em",

    // Ch
    ch1: "1ch",
    ch4: "4ch",

    // In
    in0_75: "0.75in",

    //Percent
    pct5: "5%",
  },

  letterSpacing: {
    ls0_5: 0.5,
  },

  // Grid, container, button widths
  width: {
    none: 0,

    // Percent
    pct10: "10%",
    pct25: "25%",
    pct40: "40%",
    pct50: "50%",
    pct80: "80%",
    pct90: "90%",
    pct95: "95%",
    pct100: "100%",

    // Vw
    vw70: "70vw",
    vw90: "90vw",
    vw95: "95vw",
    vw100: "100vw",

    // Em
    em52: "52em",
    em64: "64em",

    // Rem
    rem4: "4rem",
    rem4_5: "4.5rem",
    rem6: "6rem",
    rem15_5: "15.5rem",
    rem16: "16rem",
    rem20: "20rem",
    rem25: "25rem",
    rem35: "35rem",
    rem45: "45rem",
    rem41: "41rem",
    rem50: "50rem",

    // Px
    px16: "16px",
    px120: "120px",
    px130: "130px", // Also 130
    px140: "140px",
    px160: "160px", // Also 160
    px180: "180px", // Also 180
    px200: "200px",
    px220: "220px", // Also 220
    px250: "250px",
    px280: "280px",
    px300: "300px",
    px350: "350px", // Also 350
    px500: "500px",
    px600: "600px",
    px601: "601px",
    px767: "767px",
    px800: "800px",
    px900: "900px",
    px901: "901px",
    px1150: "1150px",
  },

  height: {
    none: 0,

    // Percent
    pct40: "40%",
    pct95: "95%",
    pct100: "100%",

    // Vh
    vh60: "60vh",
    vh75: "75vh",
    vh80: "80vh",
    vh100: "100vh",

    // Em
    em1_5: "1.5em",

    // Rem
    rem4: "4rem",
    rem20: "20rem",
    rem2_625: "2.625rem",
    rem30: "30rem",

    // Px
    px8: "8px",
    px12: "12px",
    px16: "16px",
    px22: "22px",
    px24: "24px",
    px28: "28px", // also 28
    px32: "32px",
    px40: "40px",
    px55: "55px",
    px60: "60px", // also 60
    px66: "66px",
    px100: "100px",
    px175: "175px",
    px200: "200px",
    px480: "480px",
    px550: "550px",
  },

  transform: {
    scale1_02: "scale(1.02)",
    scale1_03: "scale(1.03)", // could replace scale: 1.03 with transform: s1_03
    translateYNeg3px: "translateY(-3px)",
  },

  shadowScale: {
    "2x2y4b": "2px 2px 4px",
    "2y8b": "0 2px 8px",
    "3y6b": "0 3px 6px",
    "4y4b": "0 4px 4px",
    "4y8b": "0 4px 8px",
    "6y10b": "0 6px 10px",
    "8y16b": "0 8px 16px",
    "8y32b": "0 8px 32px",
    "8x8y4b": "8px 8px 4px",
  },

  transitionDurations: {
    t100: "100ms",
    t150: "150ms",
    t200: "200ms", // as 0.2s
    t250: "250ms", // as 0.25s
    t300: "300ms", // as 0.3s
    t500: "500ms", // also 0.5s
    t800: "800ms", // also 0.8s
  },

  transitionEasings: {
    ease: "ease",
    easeInOut: "ease-in-out",
  },

  zIndices: {
    z1: 1,
    z2: 2,
    z3: 3,
    z10: 10,
    z999: 999,
    z1000: 1000,
  },

  opacity: {
    none: 0,
    o0_8: 0.8,
    o1: 1,
  },
}
