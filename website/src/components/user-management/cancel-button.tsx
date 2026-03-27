import React from "react"
import { Link } from "src/components"
import * as css from "./cancel-button.css"

interface CancelButtonProps {
  onClick?: () => void
  href?: string
}

export const CancelButton = ({ onClick, href }: CancelButtonProps) => {
  const button = (
    <button type="button" onClick={onClick} className={css.cancelButton}>
      Cancel
    </button>
  )

  return href ? <Link href={href}>{button}</Link> : button
}
