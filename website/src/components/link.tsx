import React from "react"
import "vite/client"

const baseUrl = import.meta.env.BASE_URL

/**
 * Augment the link with the project base URL, allowing the project to be
 * deployed into a subdirectory.
 */
export default function Link(props: React.HTMLProps<HTMLAnchorElement>) {
  const { href, ...rest } = props
  if (!href.startsWith("/")) {
    throw new Error("Link href should start with /")
  }
  const finalHref = baseUrl + href.slice(1)
  return <a href={finalHref} {...rest} />
}
