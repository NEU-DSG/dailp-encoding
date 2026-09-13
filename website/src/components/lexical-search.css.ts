import { style } from "@vanilla-extract/css"
import { colors } from "src/style/constants"

export const searchRow = style({
  display: "flex",
  width: "70vw",
  alignItems: "stretch",
  gap: "10px",
})

export const searchInput = style({
  flex: "1 1 auto",
  height: "42px",
  boxSizing: "border-box",
})

export const filterWrapper = style({
  position: "relative",
  flex: "0 0 auto",
})

export const filterButton = style({
  cursor: "pointer",
  height: "42px",
  boxSizing: "border-box",
  padding: "0 20px",
  minWidth: "100px",
  fontSize: "1em",
  whiteSpace: "nowrap",
})

export const filterDropdown = style({
  position: "absolute",
  top: "calc(100% + 6px)",
  right: 0,
  zIndex: 9999,
  border: "1px solid darkgray",
  borderRadius: "4px",
  padding: "10px",
  marginTop: "6px",
  minWidth: "260px",
  backgroundColor: "lightgray",
})

export const filterHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
})

export const resetLink = style({
  color: colors.primary,
  cursor: "pointer",
  fontSize: "0.85em",
  textDecoration: "underline",
  background: "none",
  border: "none",
  padding: 0,
})

export const checkboxLabel = style({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  marginBottom: "4px",
})

export const filterDivider = style({
  border: "none",
  borderTop: "1px solid darkgray",
  margin: "8px 0",
})

export const filterSectionLabel = style({
  fontWeight: "bold",
  fontSize: "0.85em",
  marginBottom: "4px",
})

export const collectionSubtitle = style({
  fontSize: "0.8em",
})

export const documentCell = style({
  width: "240px",
  marginRight: "10px",
})
