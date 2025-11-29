import { StyleRule } from "@vanilla-extract/css"
import cx from "classnames"
import React from "react"

export function withClass<T extends { className?: string }>(
  css: string,
  Component: React.FC<T> | string
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

export function padding(
  y: StyleRule["padding"],
  x: StyleRule["padding"]
): StyleRule {
  return { ...paddingY(y), ...paddingX(x) }
}

export function marginX(x: StyleRule["margin"]): StyleRule {
  return { marginLeft: x, marginRight: x }
}

export function marginY(x: StyleRule["margin"]): StyleRule {
  return { marginTop: x, marginBottom: x }
}

export const onHover = (rule: StyleRule): StyleRule => ({
  "@media": {
    "(hover: hover) and (pointer: fine)": {
      selectors: {
        "&:hover": rule,
      },
    },
  },
})

/** Apply the first rule when keyboard focused, and apply the second rule when
 * unfocused or non-keyboard focus. */
export const onFocus = (
  focusedRule: StyleRule,
  notFocusedRule: StyleRule
): StyleRule => ({
  selectors: {
    "&:focus": focusedRule,
    ...(notFocusedRule
      ? { "&, &:focus:not(:focus-visible)": notFocusedRule }
      : {}),
  },
})

export const media = (query: string, rule: StyleRule): StyleRule => ({
  "@media": {
    [query]: rule,
  },
})
