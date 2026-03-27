import React from "react"
import { Button } from "reakit"
import * as css from "./close-button.css"

interface CloseButtonProps {
  onClick: () => void
  className?: string
}

export const CloseButton = ({ onClick, className }: CloseButtonProps) => {
  return (
    <Button
      className={`${css.closeButton}${className ? ` ${className}` : ""}`}
      onClick={onClick}
      aria-label="Close"
    >
      X
    </Button>
  )
}
