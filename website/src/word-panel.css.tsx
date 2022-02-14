import { style } from "@vanilla-extract/css"
import sprinkles from "./sprinkles.css"

export const wholePanel = style({
    position: "sticky",
    top: 150,
})

export const wordPanelButton = style({
    lineHeight: 1.5,
    boxSizing: "border-box",
    border: "transparent",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "0.25rem",
    ":before":{
        display: "inline-block",
        margin: "4px",
    },
    position: "absolute",
    top: "5px",
    right: "5px",
})

export const wordPanelContent = style({
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "8px",
    position: "relative",
})

export const audioContainer = style({ paddingLeft: "40%" })
