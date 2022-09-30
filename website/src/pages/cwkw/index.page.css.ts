import { style } from "@vanilla-extract/css"
import { hspace } from "src/style/constants"
import { fullWidth, paddedCenterColumn } from "src/style/utils.css"

export const centerColumn = style([paddedCenterColumn, { padding: 0 }])

export const paddedFullWidth = style([fullWidth, { padding: hspace.edge }])

export const rightColumn = style([
  centerColumn,
  { flexDirection: "row", alignItems: "flex-start" },
])

export const partialWidth = style([paddedFullWidth, { flex: 6 }])
