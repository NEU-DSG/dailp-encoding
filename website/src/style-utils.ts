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
