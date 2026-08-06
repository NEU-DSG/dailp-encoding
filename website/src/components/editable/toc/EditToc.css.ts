import { style, styleVariants } from "@vanilla-extract/css"
import { mediaQueries } from "src/style/constants"
import { button } from "../../button.css"

export const tocContainer = style({
  border: "1px solid #ddd",
  padding: 16,
  borderRadius: 8,
  boxSizing: "border-box",
  width: "95%",
  maxWidth: "95%",
})

export const headerContainer = style({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  marginBottom: 6,
})

export const collectionTitle = style({
  margin: 0,
})

export const editorContent = style({
  width: "100%",
  maxWidth: "100%",
  overflowX: "hidden",
  boxSizing: "border-box",
})

export const sectionsGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 16,
})

export const sectionHeading = style({
  marginTop: 0,
  marginBottom: 8,
  fontSize: 20,
  fontWeight: 600,
})

// overflow: hidden (both axes) rather than overflowY: auto, since the
// react-arborist Tree inside now owns its own internal scrolling entirely —
// this panel should never show a scrollbar of its own. maxHeight is no
// longer set here; the Tree's height is computed in JS (starts around 3
// rows, grows with content, caps at a 60vh-derived pixel value).
export const sectionPanel = style({
  border: "1px solid #e0e0e0",
  padding: 8,
  borderRadius: 6,
  background: "#fafafa",
  minHeight: 64 * 3,
  maxHeight: 64 * 7,
  overflow: "hidden",
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
    { border: "1px solid #28a745", background: "#f0fff4" }, // Green for pending new
  ],
})

// Applied alongside (not instead of) chapterRow's default/draft variant when
// react-arborist marks a row as selected (used to highlight the target
// chapter while a subchapter draft is open for it).
export const selectedRow = style({
  backgroundColor: "#eef5ff",
  boxShadow: "inset 0 0 0 2px #4a90e2",
})

export const chapterRowContent = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 8,
  width: "100%",
  minWidth: 0,
  "@media": {
    [mediaQueries.medium]: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  },
})

// Applied alongside chapterRowContent for any non-top-level row (subchapter
// or sub-subchapter), giving nested rows a visible left border/indent guide.
export const nestedChapterContent = style({
  boxSizing: "border-box",
  borderLeft: "2px solid #ccc",
  paddingLeft: 10,
})

// Inputs for slug, title, dragable
export const inputsOfRow = style({
  display: "flex",
  alignItems: "center",
  gap: 6,
  flex: "1 1 auto",
  minWidth: 0,
  flexWrap: "wrap",
  width: "100%",
})

// Buttons for cancel and submit
export const controlsOfRow = style({
  display: "flex",
  alignItems: "center",
  gap: 6,
  flexShrink: 0,
  flexWrap: "wrap",
  width: "100%",
  "@media": {
    [mediaQueries.medium]: {
      width: "auto",
      marginLeft: "auto",
    },
  },
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

// The round "↳" badge shown on non-top-level rows.
export const nestedBadge = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 18,
  height: 18,
  borderRadius: "50%",
  backgroundColor: "#888",
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1,
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
  boxSizing: "border-box",
})

export const titleInput = style([
  inputBase,
  {
    width: "100%",
    flex: "1 1 140px",
    "@media": {
      [mediaQueries.medium]: {
        width: 160,
      },
    },
  },
])

export const slugInput = style([
  inputBase,
  {
    width: "100%",
    flex: "1 1 110px",
    "@media": {
      [mediaQueries.medium]: {
        width: 130,
      },
    },
  },
])

export const tocButtonBase = style([
  button,
  {
    color: "white",
    fontSize: "12px",
    padding: "5px",
    margin: "5px",
    height: 28,
  },
])

export const tocButton = styleVariants({
  danger: [
    tocButtonBase,
    {
      background: "#b72d3b",
    },
  ],
  neutral: [
    tocButtonBase,
    {
      background: "#6c757d",
    },
  ],
  primary: [tocButtonBase],
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
  flexWrap: "wrap",
})

// The box the draft form renders in, kept as its own element below the Tree
// (see EditToc.tsx) rather than inside sectionPanel, so opening a draft never
// forces the panel to need its own scroll on top of the Tree's internal one.
export const draftBox = style({
  border: "1px solid #ddd",
  borderRadius: 6,
  padding: 8,
  marginTop: 8,
  background: "#fafafa",
})

export const draftParentLabel = style({
  fontSize: 11,
  color: "#666",
  margin: "0 0 4px",
})
