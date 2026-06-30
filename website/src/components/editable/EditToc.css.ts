import { style, styleVariants } from "@vanilla-extract/css"

export const container = style({
  border: "1px solid #ddd",
  padding: 16,
  borderRadius: 8,
})

export const collectionTitle = style({
  marginTop: 0,
  marginBottom: 16,
})

export const sectionsGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
  gap: 16,
})

export const sectionHeading = style({
  marginTop: 0,
  marginBottom: 8,
  fontSize: 14,
  fontWeight: 600,
})

export const sectionPanel = style({
  border: "1px solid #e0e0e0",
  padding: 8,
  borderRadius: 6,
  background: "#fafafa",
  minHeight: 60,
  maxHeight: "60vh",
  overflowY: "auto",
  overflowX: "hidden",
})

export const chapterList = style({
  listStyle: "none",
  padding: 0,
  margin: 0,
  minHeight: 24,
})

export const nestedList = style({
  listStyle: "none",
  paddingLeft: 18,
  marginTop: 4,
  minHeight: 8,
  borderLeft: "2px solid #e0e0e0",
})

export const chapterRowBase = style({
  listStyle: "none",
  margin: "4px 0",
  borderRadius: 4,
  padding: 6,
  boxSizing: "border-box",
  width: "100%",
  minWidth: 0,
})

export const chapterRow = styleVariants({
  default: [chapterRowBase, { border: "1px solid #e0e0e0" }],
  dragging: [
    chapterRowBase,
    { border: "1px solid #e0e0e0", background: "#f0f0f0" },
  ],
  draft: [
    chapterRowBase,
    { border: "1px solid #28a745", background: "#f0fff4" },
  ],
})

// Outer row: left group (identity/inputs) and right group (actions) pinned apart
export const chapterRowContent = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  width: "100%",
  minWidth: 0,
})

export const leftGroup = style({
  display: "flex",
  alignItems: "center",
  gap: 6,
  flex: "1 1 auto",
  minWidth: 0,
  flexWrap: "wrap",
})

export const rightGroup = style({
  display: "flex",
  alignItems: "center",
  gap: 6,
  flexShrink: 0,
  marginLeft: "auto",
})

export const dragHandle = style({
  color: "#666",
  cursor: "grab",
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
})

export const nestedArrow = style({
  color: "#999",
  fontSize: 11,
  flexShrink: 0,
})

export const newBadge = style({
  color: "#28a745",
  fontWeight: 600,
  fontSize: 10,
  letterSpacing: 0.5,
  flexShrink: 0,
})

export const inputBase = style({
  height: 28,
  padding: "2px 8px",
  border: "1px solid #ddd",
  borderRadius: 3,
  fontSize: 12,
  minWidth: 0,
})

export const titleInput = style([inputBase, { width: 160, flex: "1 1 140px" }])
export const slugInput = style([inputBase, { width: 130, flex: "1 1 110px" }])

export const buttonBase = style({
  padding: "5px 10px",
  fontSize: 11,
  border: "none",
  borderRadius: 3,
  cursor: "pointer",
  whiteSpace: "nowrap",
  flexShrink: 0,
})

export const buttonOutlineBase = style({
  padding: "5px 10px",
  fontSize: 11,
  borderRadius: 3,
  cursor: "pointer",
  whiteSpace: "nowrap",
  background: "transparent",
  flexShrink: 0,
})

export const button = styleVariants({
  danger: [buttonBase, { background: "#dc3545", color: "white" }],
  neutral: [buttonBase, { background: "#6c757d", color: "white" }],
  success: [buttonBase, { background: "#28a745", color: "white" }],
  primary: [buttonBase, { background: "#007bff", color: "white" }],
})

export const buttonOutline = styleVariants({
  primary: [
    buttonOutlineBase,
    { color: "#007bff", border: "1px solid #007bff" },
  ],
})

export const addChapterButton = style({
  marginTop: 6,
  padding: "6px 10px",
  background: "transparent",
  color: "#007bff",
  border: "1px dashed #007bff",
  borderRadius: 4,
  fontSize: 12,
  cursor: "pointer",
  width: "100%",
})

export const errorBanner = style({
  width: "100%",
  color: "#b00020",
  marginBottom: 8,
  padding: 6,
  background: "#ffebee",
  borderRadius: 4,
  fontSize: 12,
})

export const saveRow = style({
  display: "flex",
  gap: 8,
  alignItems: "center",
  marginTop: 16,
})

export const saveButton = style({
  padding: "8px 16px",
  border: "none",
  borderRadius: 4,
  fontSize: 13,
})

export const saveButtonState = styleVariants({
  active: [
    saveButton,
    { background: "#007bff", color: "white", cursor: "pointer" },
  ],
  disabled: [
    saveButton,
    { background: "#6c757d", color: "white", cursor: "not-allowed" },
  ],
})
