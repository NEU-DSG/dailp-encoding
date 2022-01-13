import { StyleRule } from "@vanilla-extract/css"
import cx from "classnames"
import React from "react"

export function withClass<T extends { className?: string }>(
  css: string,
  Component: React.FC<T>
) {
  return (props: React.PropsWithChildren<T>) =>
    React.createElement(Component, {
      ...props,
      className: cx(css, props.className),
    })
}

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
