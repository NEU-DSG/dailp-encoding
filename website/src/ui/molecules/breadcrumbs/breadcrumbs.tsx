import React from "react"
import * as css from "./breadcrumbs.css"

export const Breadcrumbs = (p: React.HTMLAttributes<HTMLUListElement>) => {
  const { children: baseChildren, ...rest } = p
  const children = React.Children.map(baseChildren, (e) => (
    <li className={css.breadcrumbElement}>{e}</li>
  ))
  return (
    <ul className={css.breadcrumbs} aria-label="Breadcrumbs" {...rest}>
      {children}
    </ul>
  )
}
