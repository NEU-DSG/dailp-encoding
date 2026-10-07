import { style, styleVariants } from "@vanilla-extract/css"
import { rgba } from "polished"
import { button } from "src/components/button.css"
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

// --- Breadcrumbs -----------------------------------------------------------

const crumbBase = {
  padding: "2px 4px",
  borderRadius: radii.medium,
  fontFamily: fonts.body,
  fontSize: fontSize.small,
} as const

export const breadcrumbs = style({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "2px",
  listStyle: "none",
  margin: 0,
  padding: `${vspace.eighth} ${hspace.edge}`,
  borderBottom: border,
})

export const crumbItem = style({
  display: "flex",
  alignItems: "center",
  margin: 0,
})

export const crumb = style({
  ...crumbBase,
  background: "none",
  border: "none",
  cursor: "pointer",
  color: colors.link,
  ":hover": { textDecoration: "underline" },
})

export const crumbCurrent = style({
  ...crumbBase,
  color: colors.text,
  fontWeight: "bold",
})

export const crumbSeparator = style([
  crumbItem,
  { color: colors.borders, userSelect: "none" },
])

// --- Toolbar ---------------------------------------------------------------

export const toolbar = style({
  display: "flex",
  alignItems: "center",
  gap: hspace.halfEdge,
  padding: `${vspace.quarter} ${hspace.edge}`,
  borderBottom: border,
  flexWrap: "wrap",
})

export const toolbarButton = style([
  button,
  {
    padding: "0.5rem 0.75rem",
    marginLeft: "0.25rem",
    marginRight: "0.25rem",
  },
])

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

// --- Selection toolbar -----------------------------------------------------

export const selectionToolbar = style({
  display: "flex",
  alignItems: "center",
  gap: hspace.halfEdge,
  padding: `${vspace.eighth} ${hspace.edge}`,
  borderBottom: border,
  backgroundColor: colors.bodyDark,
  fontFamily: fonts.body,
})

export const selectionCount = style({
  marginRight: hspace.halfEdge,
})

export const selectionAction = style({
  padding: `4px ${hspace.halfEdge}`,
  borderRadius: radii.large,
  fontFamily: fonts.body,
  color: colors.text,
  selectors: {
    "&:hover:not(:disabled)": { backgroundColor: rgba(0, 0, 0, 0.06) },
    "&:disabled": { opacity: 0.5, cursor: "default" },
  },
})

// --- Popup menus -----------------------------------------------------------

export const popupMenu = style({
  display: "flex",
  flexDirection: "column",
  minWidth: "160px",
  padding: "4px 0",
  zIndex: layers.second,
  border,
  borderRadius: radii.large,
  backgroundColor: colors.body,
  boxShadow: `0 4px 16px ${rgba(0, 0, 0, 0.2)}`,
})

export const popupMenuItem = style({
  padding: `6px ${hspace.halfEdge}`,
  border: "none",
  backgroundColor: "transparent",
  textAlign: "left",
  cursor: "pointer",
  fontFamily: fonts.body,
  color: colors.text,
  selectors: {
    "&:hover, &:focus": { backgroundColor: rgba(0, 0, 0, 0.06) },
    "&[aria-disabled='true']": { cursor: "default", opacity: 0.5 },
  },
})

// --- Small dialogs ---------------------------------------------------------

export const smallBackdrop = style({
  position: "fixed",
  inset: 0,
  // Nested inside the library modal's portal, so it must clear that backdrop.
  zIndex: layers.top + 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: hspace.edge,
  backgroundColor: rgba(0, 0, 0, 0.3),
})

export const smallDialog = style({
  width: "100%",
  maxWidth: "400px",
  padding: hspace.edge,
  borderRadius: radii.large,
  backgroundColor: colors.body,
  color: colors.text,
  boxShadow: `0 8px 32px ${rgba(0, 0, 0, 0.35)}`,
})

export const smallDialogTitle = style({
  margin: `0 0 ${vspace.quarter}`,
  fontFamily: fonts.header,
})

export const smallDialogLabel = style({
  display: "flex",
  flexDirection: "column",
  gap: vspace.eighth,
  fontFamily: fonts.body,
  fontSize: fontSize.small,
})

export const smallDialogInput = style({
  padding: `6px ${hspace.halfEdge}`,
  border,
  borderRadius: radii.large,
  fontFamily: fonts.body,
  fontSize: "1rem",
})

export const smallDialogActions = style({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: hspace.halfEdge,
  marginTop: vspace.half,
})

// --- Move picker -----------------------------------------------------------

export const pickerList = style({
  listStyle: "none",
  margin: `${vspace.eighth} 0 0`,
  padding: 0,
  height: "16rem",
  overflowY: "auto",
  border,
  borderRadius: radii.large,
})

const pickerItemBase = {
  display: "flex",
  alignItems: "center",
  gap: hspace.halfEdge,
  width: "100%",
  padding: `6px ${hspace.halfEdge}`,
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontFamily: fonts.body,
  color: colors.text,
  selectors: {
    "&:disabled": { cursor: "not-allowed", opacity: 0.4 },
  },
} as const

export const pickerItem = styleVariants({
  idle: [
    {
      ...pickerItemBase,
      backgroundColor: "transparent",
      selectors: {
        ...pickerItemBase.selectors,
        "&:hover:not(:disabled)": { backgroundColor: rgba(0, 0, 0, 0.06) },
      },
    },
  ],
  picked: [{ ...pickerItemBase, backgroundColor: rgba(0, 0, 0, 0.12) }],
})

export const pickerMessage = style({
  margin: `${vspace.quarter} 0 0`,
  fontFamily: fonts.body,
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

// Doubles the selected border without widening it: a wider border would grow
// the card and shift every row below it on each click.
const selectedRing = {
  borderColor: colors.primary,
  boxShadow: `0 0 0 ${thickness.thick} black`,
}

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
      ...selectedRing,
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
      ...selectedRing,
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

// --- Upload panel ----------------------------------------------------------

export const uploadPanel = style({
  borderBottom: border,
  padding: `${vspace.quarter} ${hspace.edge}`,
  backgroundColor: colors.bodyDark,
  maxHeight: "9rem",
  overflowY: "auto",
})

export const uploadHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: hspace.halfEdge,
  marginBottom: vspace.eighth,
})

export const uploadRow = style({
  display: "flex",
  alignItems: "center",
  gap: hspace.halfEdge,
  padding: `2px 0`,
  fontFamily: fonts.body,
  fontSize: fontSize.small,
})

export const uploadName = style({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
})

export const dismissButton = style({
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  color: colors.text,
  selectors: {
    "&:disabled": { opacity: 0.5, cursor: "default" },
  },
})

export const uploadStatus = styleVariants({
  normal: [{ flexShrink: 0, color: colors.text }],
  error: [{ flexShrink: 0, color: "#b3261e", whiteSpace: "normal" }],
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
