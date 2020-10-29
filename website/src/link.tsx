import React from "react"
import { Link } from "gatsby"

import {
  handleLinkClick,
  stripHashedLocation,
  handleStrippedLinkClick,
} from "gatsby-plugin-anchor-links/utils"
import { AnchorLinkProps } from "gatsby-plugin-anchor-links"

export function AnchorLink({
  to,
  title,
  children,
  className,
  onClick,
  stripHash = false,
}: AnchorLinkProps & { onClick?: () => void }) {
  const linkProps = {
    title: undefined,
    className: undefined,
    to: stripHash ? stripHashedLocation(to) : to,
    onClick: (e: any) => {
      onClick()
      stripHash ? handleStrippedLinkClick(to, e) : handleLinkClick(to, e)
    },
  }

  /**
   * Optional props
   */
  if (title) linkProps.title = title
  if (className) linkProps.className = className

  return <Link {...linkProps}>{Boolean(children) ? children : title}</Link>
}
