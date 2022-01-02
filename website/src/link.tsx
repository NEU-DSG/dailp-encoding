import React from "react"
import { usePageContext } from "renderer/PageShell"
import { navigate } from "vite-plugin-ssr/client/router"

export { Link }

function Link(props: {
  href?: string
  className?: string
  children: React.ReactNode
}) {
  const pageContext = usePageContext()
  const className = [
    props.className,
    pageContext.urlPathname === props.href && "is-active",
  ]
    .filter(Boolean)
    .join(" ")
  return (
    <a {...props} onClick={() => navigate(props.href)} className={className} />
  )
}

export default Link
