import { style } from "@vanilla-extract/css"
import { button } from "src/components/button.css"
import {
  buttonSize,
  colors,
  fontSize,
  fonts,
  hspace,
  layers,
  mediaQueries,
  radii,
  space,
  thickness,
  vspace,
} from "src/style/constants"
import { paddingX, paddingY } from "src/style/utils"

export const form = style({
  display: "flex",
  justifyContent: "flex-end",
  flex: 1,
  margin: 0,
})

export const profileSidebar = style({
  flex: "0 0 20%",
  maxWidth: "20%",
  padding: space.large,
  borderRadius: radii.medium,
  borderRight: `${thickness.thick} solid ${colors.secondaryContrast}`,
  color: colors.secondary,
  display: "flex",
  flexDirection: "column",
  gap: vspace.large,
  minHeight: "fit-content",
  position: "sticky",
  top: space.large,

  wordWrap: "break-word", // older support
  overflowWrap: "anywhere", // modern browsers
})

export const profilePage = style({
  maxWidth: "30%",
  margin: "0 auto",
  marginTop: space.large,
  marginBottom: space.large,
})

export const profileMobilePage = style({
  width: "90%",
  margin: space.large,
})

// Avatar Styles
export const avatarContainer = style({
  display: "flex",
  justifyContent: "center",
  marginTop: vspace.large,
  marginBottom: vspace.large,
})

export const avatar = style({
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  objectFit: "cover",
  border: `${thickness.thick} solid ${colors.primary}33`, // 33 is 20% opacity in hex
})

export const avatarPlaceholder = style({
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  backgroundColor: colors.primaryDark,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "3rem",
  color: colors.primaryContrast,
  border: `${thickness.thick} solid ${colors.primaryContrast}33`,
})

// User Info section
export const userInfo = style({
  textAlign: "left",
})

export const displayName = style({
  fontSize: "3rem",
  margin: "0 0 0.5rem 0",
  color: colors.primary,
})

export const role = style({
  fontSize: "1rem",
  color: colors.primary,
  margin: "0 0 1rem 0",
  fontWeight: "bold",
})

export const bioLabel = style({
  fontSize: "1rem",
  color: colors.primary,
  fontWeight: "bold",
  margin: "0",
})

export const bio = style({
  fontSize: "1rem",
  lineHeight: 1.4,
  color: colors.primary,
  margin: "0 0 1.5rem 0",
  textAlign: "left",
})

// Details Section
export const details = style({
  display: "flex",
  flexDirection: "column",
  gap: vspace.small,
  marginBottom: vspace.large,
  textAlign: "left",
})

export const detailItem = style({
  display: "flex",
  alignItems: "center",
  gap: hspace.small,
  fontSize: "1rem",
  color: colors.primary,
})

export const detailIcon = style({
  fontSize: "1rem",
  width: "1.25rem",
  textAlign: "center",
  flexShrink: 0,
  paddingRight: "1.5rem",
})

export const detailText = style({
  lineHeight: 1.4,
})

// Loading State
export const loadingState = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: vspace.medium,
  padding: space.large,
})

export const avatarSkeleton = style({
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  background: `linear-gradient(90deg, ${colors.primary} 25%, ${colors.primary} 50%, ${colors.primary} 75%)`,
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
})

export const textSkeleton = style({
  width: "80%",
  height: "1rem",
  background: `linear-gradient(90deg, ${colors.primary} 25%, ${colors.primary} 50%, ${colors.primary} 75%)`,
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
  borderRadius: radii.small,
})

// Error State
export const errorState = style({
  textAlign: "center",
  padding: space.large,
  color: colors.secondaryContrast,
  fontSize: "1rem",
})

export const editPanelButton = style([
  button,
  paddingX(hspace.large),
  paddingY(vspace.medium),
  {
    display: "flex",
    justifyContent: "space-around",
    marginLeft: hspace.small,
  },
])

export const cancelButton = style([
  {
    fontFamily: fonts.header,
    width: buttonSize.small,
  },
])

export const formInputLabel = style({
  fontFamily: fonts.header,
  fontWeight: "normal",
  fontSize: fontSize.small,
})

export const formInput = style([
  paddingX(vspace.medium),
  {
    width: "100%",
    borderRadius: radii.medium,
    textOverflow: "ellipsis",
    resize: "none",
  },
])

export const formInputLarge = style([
  formInput,
  {
    fontSize: "1.5rem",
    fontWeight: "bold",
    padding: `${space.small} ${space.medium}`,
  },
])

export const formGroup = style({
  marginBottom: vspace.medium,
})

export const formLabel = style({
  display: "block",
  fontSize: "1rem",
  fontWeight: "bold",
  color: colors.primary,
  marginBottom: space.small,
})

export const formLabelInline = style({
  display: "flex",
  alignItems: "center",
  gap: hspace.small,
  fontSize: "1rem",
  fontWeight: "bold",
  color: colors.primary,
  marginBottom: space.small,
})

// Upload Avatar Section
export const uploadSection = style({
  display: "flex",
  flexDirection: "column",
  gap: vspace.small,
})

export const uploadPreview = style({
  display: "flex",
  alignItems: "center",
  gap: hspace.small,
  padding: space.small,
  borderRadius: radii.small,
})

export const fileName = style({
  fontSize: "1rem",
  color: colors.primary,
  flex: 1,
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
})

export const uploadError = style({
  padding: space.small,
  backgroundColor: colors.secondaryContrast,
  border: `${thickness.thin} solid ${colors.secondaryContrast}`,
  borderRadius: radii.small,
  color: colors.secondary,
  fontSize: "1rem",
})

export const retryButton = style({
  background: "none",
  border: "none",
  color: colors.secondary,
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: "1rem",
})

export const chooseFileButton = style([
  button,
  paddingX(hspace.large),
  paddingY(vspace.medium),
  {
    fontFamily: fonts.header,
    width: "10rem",
  },
])
