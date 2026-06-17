import React from "react"
import * as css from "./link.css"

const baseUrl = import.meta.env.BASE_URL

/**
 * Augment the link with the project base URL, allowing the project to be
 * deployed into a subdirectory.
 */
export default function Link(props: React.HTMLProps<HTMLAnchorElement>) {
  const { href, ...rest } = props
  let finalHref = href?.startsWith("/") ? baseUrl + href.slice(1) : href
  return <a href={finalHref} className={css.link} {...rest} />
}
