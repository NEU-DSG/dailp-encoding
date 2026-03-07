import { style } from "@vanilla-extract/css"

export const container = style({
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px",
})

export const title = style({
  marginBottom: "16px",
})

export const scrollable = style({
  maxHeight: "500px",
  overflowY: "auto",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "#fff",
})

export const userList = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const userItem = style({
  padding: "16px",
  borderBottom: "1px solid #eee",
  transition: "background-color 0.2s",
  ":hover": {
    backgroundColor: "#f5f5f5",
  },
  ":last-child": {
    borderBottom: "none",
  },
})

export const userInfo = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
})

export const userName = style({
  fontWeight: 500,
  fontSize: "16px",
})

export const userRole = style({
  color: "#666",
  fontSize: "14px",
  textTransform: "uppercase",
})

export const loading = style({
  padding: "20px",
  textAlign: "center",
  color: "#666",
})

export const error = style({
  padding: "20px",
  textAlign: "center",
  color: "#d32f2f",
})

export const empty = style({
  padding: "20px",
  textAlign: "center",
  color: "#666",
})
