import React from "react"
import { navigate } from "vite-plugin-ssr/client/router"
import { usePageContext } from "src/renderer/PageShell"

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
