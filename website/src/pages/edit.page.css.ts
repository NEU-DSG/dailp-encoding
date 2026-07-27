import { style } from "@vanilla-extract/css"

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  alignItems: "center",
})

export const pathContainer = style({
  display: "flex",
  width: "80%",
  border: "1px solid #ccc",
  borderRadius: "4px",
  alignItems: "center",
})

export const pathInput = style({
  flex: 1,
  border: "none",
  outline: "none",
  padding: "8px 12px",
})

export const titleInput = style({
  width: "50%",
})

export const editorRow = style({
  display: "flex",
  flexDirection: "row",
  gap: "10px",
  width: "100%",
})

export const editorPane = style({
  position: "relative",
  display: "flex",
  width: "50%",
  border: "1px solid black",
})

export const contentTextarea = style({
  width: "100%",
  minHeight: "200px",
  border: "none",
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
  // Leave room at the bottom so the floating media button never sits over text.
  padding: "8px 8px 48px",
})

export const mediaButton = style({
  position: "absolute",
  bottom: "8px",
  left: "8px",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "8px 12px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  background: "#f5f5f5",
  cursor: "pointer",
})

export const hiddenFileInput = style({
  display: "none",
})

export const previewPane = style({
  border: "1px solid black",
  padding: "10px",
  width: "50%",
  minHeight: "200px",
})

export const saveButton = style({
  width: "50%",
})
