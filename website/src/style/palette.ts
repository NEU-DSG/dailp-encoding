// Add raw theme.css.ts and constants.ts values?

export const palette = {
  colors: {
    // White
    white: "#ffffff", // also "white"
    whiteAlpha65: "rgba(255, 255, 255, 0.65)",
    offWhite: "#fbf6ec",
    darkOffWhite: `darken(0.1, "#fbf6ec")`,

    // Black
    black: "#000000", // also "#000000ff"
    darkCharcoal: "#333333",
    blackAlpha10: "rgba(0, 0, 0, 0.1)",
    blackAlpha20: "rgba(0, 0, 0, 0.2)",
    blackAlpha30: "rgba(0, 0, 0, 0.3)",

    // Gray
    boldGray: "#666666",
    chaliceGray: "#ADADAD",
    darkGray: "darkgray",
    lightGray: "lightgrey",
    marbleGray: "#e8e8e8ff",
    silverGrayAlpha65: "rgba(207, 205, 205, 0.65)",

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

    // Brown
    cocoaBrown: "#5C3A37",
    nutmegBrown: "#8D6660",
    blushBrown: "#AD7D77",

    // Red
    lightZuriRed: `lighten(0.6, "#9d2832")`,
    darkZuriRed: `darken(0.2, "#9d2832")`,

    // Orange
    goldOrange: "#E6B469",
  },

  fontSizes: {
    // Px
    px11: "11px",
    px12: "12px",
    px14: "14px",
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
    rem1_1: "1.1rem",
    rem1_15: "1.15rem",
    rem1_25: "1.25rem",
    rem1_3: "1.3rem",
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
    none: 0,

    // Unitless
    lh1: 1,
    lh1_2: 1.2,
    lh1_47: 1.47,
    lh1_6: 1.6,

    // Px
    px28: "28px",
  },

  radii: {
    none: 0,

    // Px
    px4: "4px",
    px8: "8px",
    px45: "45px",
    px999: "999px",

    // Rem
    rem0_25: "0.25rem",
  },

  borderWidths: {
    none: 0,

    px1: "1px",
    px4: "4px",
    px10: "10px",
  },

  // Margin, padding, and gap
  spacing: {
    none: 0, // also "0em"

    // Px
    px2: "2px", // also "2"
    px3: "3px",
    px4: "4px",
    px5: "5px",
    px6: "6px", // also "6"
    px7: "7px",
    px8: "8px", // also "8"
    px10: "10px", // also "10"
    px12: "12px", // also "12"
    px15: "15px",
    px16: "16px", // also "16"
    px18: "18px", // also "18"
    px20: "20px",
    px24: "24px",
    px30: "30px",
    px32: "32px",
    px35: "35px",
    px40: "40px",
    px48: "48px",
    px50: "50px",
    px60: "60px",
    px64: "64px",
    px80: "80px",
    px100: "100px",

    // Rem
    rem0_25: "0.25rem",
    rem0_5: "0.5rem",
    rem0_75: "0.75rem",
    rem1: "1rem",
    rem1_5: "1.5rem",
    rem2: "2rem",
    rem3: "3rem",
    rem3_5: "3.5rem",
    rem4: "4rem",

    // Ch
    ch4: "4ch",
  },

  // Grid, container widths
  width: {
    none: 0,

    // Percent
    pct25: "25%",
    pct40: "40%",
    pct50: "50%",
    pct80: "80%",
    pct90: "90%",
    pct95: "95%",
    pct100: "100%",

    // Vw
    vw90: "90vw",
    vw95: "95vw",
    vw100: "100vw",

    // Em
    em52: "52em",
    em64: "64em",

    // Rem
    rem4: "4rem",
    rem15_5: "15.5rem",
    rem16: "16rem",
    rem20: "20rem",
    rem25: "25rem",
    rem35: "35rem",
    rem45: "45rem",

    // Px
    px16: "16px",
    px120: "120px",
    px130: "130px", // Also "130"
    px140: "140px",
    px180: "180px", // Also "180"
    px200: "200px",
    px220: "220px", // Also "220"
    px250: "250px",
    px280: "280px",
    px300: "300px",
    px350: "350px", // Also "350"
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
    px28: "28px",
    px32: "32px",
    px40: "40px",
    px55: "55px",
    px60: "60px",
    px66: "66px",
    px100: "100px",
    px175: "175px",
    px200: "200px",
    px480: "480px",
    px550: "550px",
  },

  // better names?
  shadowScale: {
    elevation1: "0 4px 4px", // Smallest offset/blur
    elevation2: "0 2px 8px",
    elevation3: "0 4px 8px",
    elevation4: "0 8px 32px", // Largest offset/blur
  },

  transitionDurations: {
    t150: "150ms",
    t500: "500ms",
    t800: "800ms",
  },

  zIndices: {
    z1: 1,
    z10: 10,
    z1000: 1000,
  },
}
