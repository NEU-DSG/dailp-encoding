import { style } from "@vanilla-extract/css"
import { flowRight } from "lodash-es"
import { important, position } from "polished"
import { button } from "src/components/button.css"
import { rightButton } from "src/components/carousel.css"
import {
  colors,
  fonts,
  hspace,
  layers,
  mediaQueries,
  radii,
  thickness,
  vspace,
} from "src/style/constants"
import { paddingX, paddingY } from "src/style/utils"
import { largeDialog, std } from "src/style/utils.css"

export const docTitle = std.fullWidth

export const annotationContents = style({
  width: "100%",
  flex: 2,
})

export const topMargin = style({
  marginTop: vspace.half,
})

export const alignRight = style({
  marginBottom: vspace.half,
  display: "flex",
  justifyContent: "right",
})

export const bottomPadded = style({
  marginBottom: vspace.half,
  display: "flex",
  flexFlow: "row wrap",
  alignItems: "center",
  justifyContent: "space-between",
  "@media": {
    [mediaQueries.print]: {
      display: "none",
    },
  },
})

export const displayModeArea = style({
  backgroundColor: colors.body,
  position: "sticky",
  top: `calc(55px + ${vspace[1.75]})`,
  width: "100%",
  zIndex: layers.base,
  paddingTop: vspace.quarter,
  paddingBottom: vspace.quarter,
  "@media": {
    [mediaQueries.medium]: {
      top: vspace[1.75],
    },
    [mediaQueries.print]: {
      display: "none",
      height: 0,
    },
  },
})

export const wideAndTop = style({
  left: 0,
  display: "flex",
  flexFlow: "column nowrap",
  alignItems: "center",
  position: "sticky",
  top: 55,
  width: "100%",
  zIndex: layers.base,
  "@media": {
    [mediaQueries.medium]: {
      top: 0,
    },
    [mediaQueries.print]: {
      display: "none",
      height: 0,
    },
  },
})

export const docTab = style({
  borderRadius: 0,
  border: "none",
  flexGrow: 1,
  cursor: "pointer",
  fontFamily: fonts.header,
  fontSize: "1.1rem",
  backgroundColor: colors.secondary,
  color: colors.secondaryContrast,
  outlineColor: colors.secondaryContrast,
  selectors: {
    '&[aria-selected="true"]': {
      borderBottom: `2px solid ${colors.secondaryContrast}`,
    },
  },
})

export const docTabs = style([
  std.fullWidth,
  important({
    margin: 0,
  }),
  {
    display: "flex",
    flexFlow: "row nowrap",
    height: vspace[1.75],
  },
])
export const docTabPanel = style([
  std.fullWidth,
  paddingX(hspace.halfEdge),
  {
    "@media": {
      [mediaQueries.medium]: paddingX(0),
    },
    selectors: {
      "&:focus": {
        outline: "none",
      },
    },
  },
])

export const imageTabPanel = style([std.fullWidth, { outline: "none" }])

export const docHeader = style([
  std.fullWidth,
  paddingY(0),
  paddingX(hspace.edge),
  {
    "@media": {
      [mediaQueries.print]: paddingX(0),
    },
  },
])

export const morphemeDialog = style([
  largeDialog,
  {
    borderRadius: radii.medium,
    borderColor: colors.borders,
    borderWidth: thickness.thin,
    backgroundColor: colors.body,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100vw",
    margin: 0,
    zIndex: layers.top,
  },
])

export const unpaddedMorphemeDialog = style([
  morphemeDialog,
  {
    padding: 0,
  },
])

export const morphemeDialogBackdrop = style({
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.2)",
  zIndex: layers.third,
})

export const annotatedDocument = style({
  alignItems: "center",
  "@media": {
    [mediaQueries.medium]: paddingX(hspace.edge),
  },
})

export const audioContainer = style([
  {
    display: "flex",
    flexFlow: "row nowrap",
  },
  topMargin,
  bottomPadded,
])

export const hideOnPrint = style({
  "@media": {
    print: { display: "none" },
  },
})

export const paragraph = style([topMargin, hideOnPrint])

export const contentContainer = style({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
})

export const contentSection2 = style({
  display: "none",
  width: "20rem",
  minWidth: 0,
  "@media": {
    [mediaQueries.medium]: {
      display: "block",
    },
  },
})

export const mobileWordPanel = style([
  position("fixed", 0, 0, 0, "initial"),
  {
    width: "15.5rem",
    maxWidth: "90vw",
    backgroundColor: colors.body,
    fontFamily: fonts.header,
    transition: "transform 150ms ease-in-out",
    transform: "translateX(16rem)",
    selectors: {
      "&[data-enter]": {
        transform: "translateX(0)",
      },
    },
    "@media": {
      [mediaQueries.medium]: {
        display: "none",
      },
    },
  },
])

// export const hideScrollTop = style({
//   display: "flex",
//   flexFlow: "column nowrap",
//   justifyContent: "flex-end",
//   alignContent: "center",
//   alignItems: "center",
//   alignSelf: "flex-end",
//   position: "sticky",
//   zIndex: 1,
//   top: `calc(100vh + 100px)`,
//   right: 0,
//   padding: vspace.quarter,
//   color: colors.secondaryContrast,
//   outlineColor: colors.secondaryContrast,
//   backgroundColor: colors.secondary,
//   visibility: "visible",
//   opacity: 1,
//   transition: "top 0.8s",
// })

// export const showScrollTop = style(
//   {
//   display: "flex",
//   flexFlow: "column nowrap",
//   justifyContent: "flex-end",
//   alignContent: "center",
//   alignItems: "center",
//   alignSelf: "flex-end",
//   position: "sticky",
//   zIndex: 1,
//   top: `calc(100vh - 100px)`,
//   right: 0,
//   padding: vspace.quarter,
//   color: colors.secondaryContrast,
//   outlineColor: colors.secondaryContrast,
//   backgroundColor: colors.secondary,
//   visibility: "visible",
//   opacity: 1,
//   transition: "top 0.5s",
//   }
// )

export const scrollTop = style({
  display: "flex",
  flexFlow: "column nowrap",
  justifyContent: "flex-end",
  alignContent: "center",
  alignItems: "center",
  alignSelf: "flex-end",
  position: "sticky",
  zIndex: 1,
  right: 0,
  padding: vspace.quarter,
  color: colors.secondaryContrast,
  outlineColor: colors.secondaryContrast,
  backgroundColor: colors.secondary,
})

export const BookmarkButton = style([
  button,
  paddingX(hspace.large),
  paddingY(vspace.medium),
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 35px",
    backgroundColor: "#405372",
    color: "white",
    fontFamily: "'Inter', sans-serif",
    fontWeight: "600",
    fontSize: "16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    minWidth: "140px",
    ":hover": {
      backgroundColor: "#6F85A9",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  },
])
export const hideScrollTop = style([
  scrollTop,
  {
    top: `calc(100vh + 100px)`,
    visibility: "visible",
    opacity: 1,
    transition: "top 0.8s",
  },
])

export const showScrollTop = style([
  scrollTop,
  {
    top: `calc(100vh - 100px)`,
    visibility: "visible",
    opacity: 1,
    transition: "top 0.5s",
  },
])

export const noScrollTop = style({
  visibility: "hidden",
  opacity: 0,
})

// New styles
export const container = style({
  maxWidth: "1200px",
  margin: "50px auto 20px auto",
  padding: "32px",
  backgroundColor: "#ffffff",
});

export const documentLayout = style({
  display: "flex",
  flexDirection: "row",
  gap: "48px",
  alignItems: "flex-start",
});

export const documentLayoutMobile = style({
  flexDirection: "column",
  gap: "32px",
});

export const documentImageContainer = style({
  flexShrink: 0,
});

export const documentImage = style({
  width: "320px",
  height: "400px",
  objectFit: "cover",
  border: "8px solid #2d3748",
  borderRadius: "4px",
  display: "block",
});

export const documentImageMobile = style({
  width: "100%",
  height: "300px",
});

export const contentSection = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  paddingTop: "8px",
});

export const breadcrumb = style({
  fontSize: "18px",
  color: "#405372",
  fontWeight: "600",
  marginBottom: "15px",
  textDecoration: "none",
  ":hover": {
    textDecoration: "underline",
  },
});

export const titleContainer = style({
  marginBottom: "8px",
});

export const title = style({
  fontSize: "48px",
  fontWeight: "700",
  color: "#2d3748",
  lineHeight: "1.1",
  margin: "0",
});

export const titleMobile = style({
  fontSize: "32px",
});

export const year = style({
  fontSize: "24px",
  fontFamily: "'Spectral SC', serif",
  color: "#718096",
  fontWeight: "600",
  marginLeft: "16px",
});

export const yearMobile = style({
  fontSize: "20px",
  marginLeft: "8px",
});

export const documentTypes = style({
  display: "flex",
  gap: "32px",
  marginBottom: "8px",
});

export const documentTypesMobile = style({
  flexDirection: "column",
  gap: "16px",
});

export const documentType = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",
});

export const documentIcon = style({
  width: "32px",
  height: "32px",
  color: "#4a5568",
});

export const documentIconMobile = style({
  width: "24px",
  height: "24px",
});

export const documentTypeText = style({
  fontSize: "18px",
  color: "#2d3748",
  fontWeight: "600",
});

export const documentTypeTextMobile = style({
  fontSize: "16px",
});

export const description = style({
  fontSize: "18px",
  color: "#000000",
  lineHeight: "1.6",
  marginBottom: "12px",
  maxWidth: "900px",
});

export const descriptionMobile = style({
  fontSize: "14px",
});

export const actionButtons = style({
  margin: "10px 0 0 0",
  display: "flex",
  gap: "16px",
});

export const actionButtonsMobile = style({
  flexDirection: "column",
  gap: "12px",
});

export const actionButton = style([
  button,
  paddingX(hspace.large),
  paddingY(vspace.medium),
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 35px",
    backgroundColor: "#405372",
    color: "white",
    fontFamily: "'Inter', sans-serif",
    fontWeight: "600",
    fontSize: "16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    minWidth: "140px",
    ":hover": {
      backgroundColor: "#6F85A9",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  },
]);

export const actionButtonMobile = style({
  padding: "10px 20px",
  fontSize: "14px",
  minWidth: "120px",
});

export const buttonIcon = style({
  width: "20px",
  height: "20px",
});

export const buttonIconMobile = style({
  width: "16px",
  height: "16px",
});

export const infoTitle = style({
  fontSize: "28px",
  fontWeight: "600",
  color: "#333333",
  margin: "0 0 8px 0",
})

export const uploadedEditedTimes = style({
  fontSize: "16px",
  color: "#666666",
  margin: "10px 0 50px 0",
})

export const infoHeader = style({
  position: "relative",
  textAlign: "center",
  marginBottom: "32px",
})

export const infoSection = style({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
})

export const field = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  paddingBottom: "16px",
  borderBottom: "1px solid #ADADAD",
})

export const label = style({
  fontSize: "20px",
  fontWeight: "600",
  color: "#8D6660",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
})

export const value = style({
  fontSize: "16px",
  color: "#333333",
  lineHeight: 1.5,
})

export const link = style({
  color: "#4A90E2",
  textDecoration: "underline",
})
