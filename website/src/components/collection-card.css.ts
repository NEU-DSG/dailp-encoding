import { globalStyle, style } from "@vanilla-extract/css"
import { fonts, radii, space } from "src/style/constants"
import { button } from "./button.css"

export const collectionCard = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  width: "25%",
  minHeight: "480px",
  minWidth: "300px",
  border: "1px solid black",
  borderRadius: radii.medium,
  overflow: "hidden",
  ":hover": {
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    transform: "translateY(-3px)",
  },
})

export const cardContent = style({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: "0px 20px 20px",
})

export const collectionCardImageContainer = style({
  position: "relative",
})

export const collectionCardImage = style({
  width: "100%",
  maxHeight: "175px",
  objectFit: "cover",
  padding: 0,
  borderTopLeftRadius: radii.medium,
  borderTopRightRadius: radii.medium,
})

export const collectionCardHeader = style({
  fontFamily: fonts.header,
  fontWeight: "bold",
  textDecoration: "none",
  color: "#405372",
  margin: 0,
  paddingBottom: "4px",
  flexGrow: 1,
})

globalStyle(`${collectionCardHeader} a`, {
  textDecoration: "none",
  color: "inherit",
  margin: 0,
  padding: 0,
})

globalStyle(`${collectionCardHeader} a:hover`, {
  textDecoration: "underline",
})

export const collectionCardText = style({
  fontFamily: fonts.body,
  paddingTop: space.none,
  paddingBottom: space.large,
  flexGrow: 1,
})

export const actionButton = style({
  textDecoration: "none",
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "16px 35px",
  backgroundColor: "#405372",
  boxShadow: "0 3px 6px rgba(0, 0, 0, 0.3)",
  color: "white",
  fontFamily: fonts.header,
  fontWeight: "600",
  fontSize: "18px",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  minWidth: "140px",
  ":hover": {
    backgroundColor: "#222d3d",
    boxShadow: "0 6px 10px rgba(0, 0, 0, 0.4)",
    transform: "scale(1.02)",
  },
})

export const toggleButton = style([
  button,
  {
    position: "absolute",
    top: "8px",
    right: "8px",
    padding: "2px 8px",
    margin: 0,
    fontSize: "16px",
    backgroundColor: "#f0f0f0",
    borderColor: "#aaa",
    color: "#555",
    zIndex: 1,
    boxShadow: "none",
    ":hover": {
      backgroundColor: "#e0e0e0",
    },
    ":active": {
      boxShadow: "none",
    },
  },
])

export const badgeWrapper = style({
  paddingBottom: "8px",
})

export const publishedBadge = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "4px 12px",
  backgroundColor: "#405372",
  fontSize: "12px",
  borderRadius: radii.large,
  color: "white",
})

export const hiddenBadge = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "4px 12px",
  border: "1px solid #ccc",
  fontSize: "12px",
  borderRadius: radii.large,
  color: "#666",
})

export const headerSection = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  paddingBottom: "10px",
})

export const titleWrapper = style({
  paddingBottom: "5px",
})
