import React from "react"

const baseUrl = import.meta.env.BASE_URL

/**
 * Augment the link with the project base URL, allowing the project to be
 * deployed into a subdirectory.
 */
export default function Link(props: React.HTMLProps<HTMLAnchorElement>) {
  const { href, ...rest } = props
  let finalHref
  if (href.startsWith("/")) {
    finalHref = baseUrl + href.slice(1)
  } else {
    finalHref = href
  }
  return <a href={finalHref} {...rest} />
}
