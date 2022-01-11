import { StyleRule } from "@vanilla-extract/css"
import cx from "classnames"
import { withProps } from "recompose"

export const withClass = (css: string) =>
  withProps(({ className }) => ({
    className: cx(css, className),
  }))

export function paddingX(x: StyleRule["padding"]): StyleRule {
  return { paddingLeft: x, paddingRight: x }
}

export function paddingY(x: StyleRule["padding"]): StyleRule {
  return { paddingTop: x, paddingBottom: x }
}

export function marginX(x: StyleRule["margin"]): StyleRule {
  return { marginLeft: x, marginRight: x }
}

export function marginY(x: StyleRule["margin"]): StyleRule {
  return { marginTop: x, marginBottom: x }
}
