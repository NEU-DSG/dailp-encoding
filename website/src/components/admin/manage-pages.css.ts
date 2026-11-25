import { globalStyle, style } from "@vanilla-extract/css"
import {
  colors,
  fonts,
  hspace,
  mediaQueries,
  radii,
  space,
  thickness,
  vspace,
} from "src/style/constants"
import { paddingX, paddingY } from "src/style/utils"
import { paddedCenterColumn, std } from "src/style/utils.css"

export const wrapper = style([
  paddedCenterColumn,
  std.fullWidth,
  {
    alignItems: "stretch",
  },
])

export const header = style({
  fontFamily: fonts.header,
  color: colors.headings,
  marginBottom: vspace.half,
})

export const toolbar = style({
  display: "flex",
  flexFlow: "row wrap",
  alignItems: "center",
  gap: hspace.edge,
  paddingBottom: vspace.half,
  borderBottom: `${thickness.thin} solid ${colors.borders}`,
  marginBottom: vspace.half,
})

export const searchGroup = style({
  display: "flex",
  alignItems: "center",
  gap: space.small,
  flexGrow: 1,
  flexShrink: 1,
  minWidth: 0,
  maxWidth: "32rem",
})

export const searchIcon = style({
  color: colors.text,
  fontSize: "1.1rem",
  flexShrink: 0,
})

export const searchInput = style([
  paddingX(hspace.halfEdge),
  paddingY(space.small),
  {
    flexGrow: 1,
    minWidth: 0,
    width: "100%",
    fontFamily: fonts.body,
    fontSize: "0.95rem",
    border: `${thickness.thin} solid ${colors.borders}`,
    borderRadius: radii.medium,
    background: colors.body,
    color: colors.text,
    ":focus": {
      outline: "none",
      borderColor: colors.focus,
    },
  },
])

export const filterIcon = style({
  color: colors.text,
  fontSize: "1.2rem",
})

export const filterGroup = style({
  display: "flex",
  alignItems: "center",
  gap: space.small,
  fontFamily: fonts.body,
})

export const select = style([
  paddingX(hspace.halfEdge),
  paddingY(space.small),
  {
    fontFamily: fonts.body,
    fontSize: "0.95rem",
    border: `${thickness.thin} solid ${colors.borders}`,
    borderRadius: radii.medium,
    background: colors.body,
    color: colors.text,
    cursor: "pointer",
  },
])

export const newPageButton = style([
  paddingX(hspace.edge),
  paddingY(space.small),
  {
    display: "inline-flex",
    alignItems: "center",
    gap: space.small,
    marginLeft: "auto",
    fontFamily: fonts.header,
    fontSize: "0.95rem",
    color: colors.primaryText,
    backgroundColor: colors.primary,
    border: `${thickness.thin} solid ${colors.primaryDark}`,
    borderRadius: radii.medium,
    textDecoration: "none",
    cursor: "pointer",
    ":hover": {
      backgroundColor: colors.primaryDark,
    },
  },
])

export const list = style({
  listStyleType: "none",
  padding: 0,
  margin: 0,
})

export const row = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  rowGap: space.small,
  columnGap: hspace.edge,
  alignItems: "center",
  paddingTop: vspace.half,
  paddingBottom: vspace.half,
  borderBottom: `${thickness.thin} solid ${colors.borders}`,
  "@media": {
    [mediaQueries.medium]: {
      gridTemplateColumns: "minmax(0, 1fr) auto auto",
      rowGap: 0,
    },
  },
})

export const pageTitleGroup = style({
  display: "flex",
  alignItems: "center",
  gap: space.medium,
  minWidth: 0,
})

export const pageTitle = style({
  fontFamily: fonts.body,
  fontSize: "1rem",
  color: colors.link,
  textDecoration: "none",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  minWidth: 0,
  ":hover": {
    textDecoration: "underline",
  },
})

export const editIcon = style([
  {
    background: "none",
    border: "none",
    padding: 0,
    color: colors.text,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    fontSize: "1rem",
    ":hover": {
      color: colors.link,
    },
  },
])

export const locationGroup = style({
  display: "flex",
  alignItems: "center",
  gap: space.small,
  fontFamily: fonts.body,
  fontSize: "0.95rem",
})

export const deleteButton = style({
  display: "inline-flex",
  alignItems: "center",
  gap: space.small,
  fontFamily: fonts.body,
  fontSize: "0.95rem",
  background: "none",
  border: "none",
  color: colors.text,
  cursor: "pointer",
  padding: 0,
  ":hover": {
    color: colors.primary,
  },
})

export const confirmGroup = style({
  display: "inline-flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: space.small,
  fontFamily: fonts.body,
  fontSize: "0.95rem",
})

globalStyle(`${confirmGroup} button`, {
  paddingTop: space.medium,
  paddingBottom: space.medium,
  paddingLeft: space.large,
  paddingRight: space.large,
  marginLeft: 0,
  marginRight: 0,
})

export const confirmLabel = style({
  color: colors.text,
  paddingRight: space.small,
})

export const empty = style({
  fontFamily: fonts.body,
  color: colors.text,
  paddingTop: vspace.one,
})
