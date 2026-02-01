import { globalStyle, style } from "@vanilla-extract/css"
import { fonts, radii, space } from "src/style/constants"

export const collectionCard = style({
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
        transform: "translateY(-3px)"
    },
})

export const cardContent = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexGrow: 1,
    padding: "0px 20px 20px",
})

export const collectionCardImage = style([
    {
        width: "100%",
        maxHeight: "175px",
        objectFit: "cover",
        padding: 0,
        borderTopLeftRadius: radii.medium,
        borderTopRightRadius: radii.medium,
    }
])

export const collectionCardHeader = style({
    fontFamily: fonts.header,
    fontWeight: "bold",
    textDecoration: "none",
    color: "#405372",
    margin: 0,
    paddingBottom: "10px",
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

export const collectionCardText = style([
    {
        fontFamily: fonts.body,
        paddingTop: space.none,
        paddingBottom: space.large
    }
])

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
        transform: "scale(1.02)"
    },
});

