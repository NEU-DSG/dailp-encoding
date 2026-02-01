import { globalStyle, style } from "@vanilla-extract/css"
import { fonts, radii } from "src/style/constants"

export const storyCard = style({
    display: "flex",
    flexDirection: "column",
    width: "25%",
    flexGrow: 1,
    minWidth: "250px",
    maxWidth: "300px",
    border: "1px solid black",
    borderRadius: radii.medium,
    overflow: "hidden",
    ":hover": {
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        transform: "translateY(-3px)"
    },
})

export const cardContent = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexGrow: 1,
    paddingLeft: "20px",
    paddingRight: "20px"
})

export const storyCardImage = style([
    {
        width: "100%",
        maxHeight: "175px",
        objectFit: "cover",
        borderTopLeftRadius: radii.medium,
        borderTopRightRadius: radii.medium,
    }
])

export const storyCardHeader = style({
    fontFamily: fonts.header,
    fontWeight: "bold",
    textDecoration: "none",
    color: "#405372",
    margin: 0,
    padding: 0,
})

globalStyle(`${storyCardHeader} a`, {
  textDecoration: "none",
  color: "inherit",
  margin: 0,
  padding: 0,
})

globalStyle(`${storyCardHeader} a:hover`, {
    textDecoration: "underline",
})

export const storyCardSubheading = style({
    fontWeight: "bold",
    marginTop: "10px",
})