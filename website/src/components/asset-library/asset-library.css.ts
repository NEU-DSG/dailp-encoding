import { style, styleVariants } from "@vanilla-extract/css"
import { rgba } from "polished"
import {
  colors,
  fontSize,
  fonts,
  hspace,
  layers,
  radii,
  thickness,
  vspace,
} from "src/style/constants"

const border = `${thickness.thin} solid ${colors.borders}`

// --- Modal shell -----------------------------------------------------------

export const backdrop = style({
  position: "fixed",
  inset: 0,
  zIndex: layers.top,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: hspace.edge,
  backgroundColor: rgba(0, 0, 0, 0.4),
  opacity: 0,
  transition: "opacity 120ms ease-in-out",
  selectors: {
    "&[data-enter]": { opacity: 1 },
  },
})

export const dialog = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "1200px",
  height: "85vh",
  backgroundColor: colors.body,
  color: colors.text,
  borderRadius: radii.large,
  boxShadow: `0 8px 32px ${rgba(0, 0, 0, 0.35)}`,
  overflow: "hidden",
})

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: hspace.halfEdge,
  padding: `${vspace.quarter} ${hspace.edge}`,
  backgroundColor: colors.primary,
  color: colors.primaryContrast,
})

export const headerTitle = style({
  margin: 0,
  fontFamily: fonts.header,
  fontSize: "1.1rem",
  color: rgba(255, 255, 255, 1),
})

export const closeButton = style({
  display: "flex",
  alignItems: "center",
  color: colors.primaryContrast,
})

// --- Toolbar ---------------------------------------------------------------

export const toolbar = style({
  display: "flex",
  alignItems: "center",
  gap: hspace.halfEdge,
  padding: `${vspace.quarter} ${hspace.edge}`,
  borderBottom: border,
  flexWrap: "wrap",
})

export const search = style({
  flex: 1,
  minWidth: "180px",
  padding: `6px ${hspace.halfEdge}`,
  border,
  borderRadius: radii.round,
  backgroundColor: colors.bodyDark,
  color: colors.text,
  fontFamily: fonts.body,
})

export const viewToggle = style({
  display: "flex",
  border,
  borderRadius: radii.large,
  overflow: "hidden",
})

const toggleBase = {
  display: "flex",
  alignItems: "center",
  padding: "6px 10px",
  border: "none",
  cursor: "pointer",
  fontFamily: fonts.body,
} as const

export const viewToggleButton = styleVariants({
  inactive: [
    { ...toggleBase, backgroundColor: "transparent", color: colors.text },
  ],
  active: [
    {
      ...toggleBase,
      backgroundColor: colors.primary,
      color: colors.primaryContrast,
    },
  ],
})

// --- Body: browser + side panel -------------------------------------------

export const body = style({
  display: "flex",
  flex: 1,
  minHeight: 0,
})

export const browser = style({
  flex: 1,
  minWidth: 0,
  overflowY: "auto",
  padding: hspace.edge,
})

export const sectionHeading = style({
  margin: `${vspace.quarter} 0 ${vspace.eighth}`,
  fontFamily: fonts.header,
  fontSize: fontSize.small,
  color: colors.headings,
})

export const emptyMessage = style({
  padding: vspace.one,
  textAlign: "center",
  color: colors.text,
  fontStyle: "italic",
})

// --- Grid view -------------------------------------------------------------

export const folderGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: hspace.halfEdge,
  marginBottom: vspace.half,
})

export const imageGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: hspace.halfEdge,
})

const cardBase = {
  display: "flex",
  width: "100%",
  border,
  borderRadius: radii.large,
  backgroundColor: colors.bodyDark,
  cursor: "pointer",
  textAlign: "left" as const,
  fontFamily: fonts.body,
  color: colors.text,
} as const

// Compact folder card, like Google Drive's folder chips.
export const folderCard = styleVariants({
  unselected: [
    {
      ...cardBase,
      alignItems: "center",
      gap: hspace.halfEdge,
      padding: "10px",
    },
  ],
  selected: [
    {
      ...cardBase,
      alignItems: "center",
      gap: hspace.halfEdge,
      padding: "10px",
      borderColor: colors.primary,
      backgroundColor: rgba(0, 0, 0, 0.06),
    },
  ],
})

// Taller image card: thumbnail area above a label row.
export const imageCard = styleVariants({
  unselected: [{ ...cardBase, flexDirection: "column", padding: 0 }],
  selected: [
    {
      ...cardBase,
      flexDirection: "column",
      padding: 0,
      borderColor: colors.primary,
    },
  ],
})

export const thumbnail = style({
  width: "100%",
  height: "130px",
  objectFit: "cover",
  backgroundColor: rgba(0, 0, 0, 0.08),
})

export const cardLabel = style({
  display: "flex",
  alignItems: "center",
  gap: hspace.halfEdge,
  padding: "10px",
  minWidth: 0,
})

export const itemName = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  minWidth: 0,
})

// --- List view -------------------------------------------------------------

export const list = style({
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: fonts.body,
})

export const listHeaderCell = style({
  textAlign: "left",
  padding: `6px ${hspace.halfEdge}`,
  borderBottom: border,
  fontFamily: fonts.header,
  fontSize: fontSize.small,
  color: colors.headings,
  whiteSpace: "nowrap",
})

export const listRow = styleVariants({
  unselected: [
    {
      cursor: "pointer",
      selectors: { "&:hover": { backgroundColor: rgba(0, 0, 0, 0.04) } },
    },
  ],
  selected: [{ cursor: "pointer", backgroundColor: rgba(0, 0, 0, 0.08) }],
})

export const listCell = style({
  padding: `6px ${hspace.halfEdge}`,
  borderBottom: border,
  verticalAlign: "middle",
})

export const listNameCell = style({
  display: "flex",
  alignItems: "center",
  gap: hspace.halfEdge,
  minWidth: 0,
})

export const listMetaCell = style({
  padding: `6px ${hspace.halfEdge}`,
  borderBottom: border,
  whiteSpace: "nowrap",
  color: colors.text,
  fontSize: fontSize.small,
})

// --- Side panel (stub) -----------------------------------------------------

export const sidePanel = style({
  width: "300px",
  flexShrink: 0,
  borderLeft: border,
  padding: hspace.edge,
  overflowY: "auto",
  backgroundColor: colors.body,
})

export const sidePanelPlaceholder = style({
  color: colors.text,
  fontStyle: "italic",
})
