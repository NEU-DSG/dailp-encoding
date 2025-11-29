import { style } from "@vanilla-extract/css"

export const contributeAudioContainer = style({
  position: "relative",
})

export const contributeAudioOptions = style({
  display: "flex",
  textAlign: "center",
  justifyContent: "space-between",
})

export const contributeAudioOptionsItem = style({
  display: "inline-block",
})

export const statusMessage = style({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255,255,255,0.65)",
  color: "black",
  padding: 10,
  backdropFilter: "blur(2px)",
  border: "4px solid grey",
})

export const statusMessageError = style({
  borderColor: "red",
})
