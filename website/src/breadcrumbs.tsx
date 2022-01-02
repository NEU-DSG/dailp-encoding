import React from "react"
import * as css from "./breadcrumbs.css"

export const Breadcrumbs = (p: React.HTMLAttributes<HTMLUListElement>) => {
  let { children: baseChildren, ...rest } = p
  const children = React.Children.map(baseChildren, (e) => (
    <li className={css.breadcrumbElement}>{e}</li>
  ))
  return (
    <ul className={css.breadcrumbs} {...rest}>
      {children}
    </ul>
  )
}
