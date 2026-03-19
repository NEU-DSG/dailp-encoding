import React from "react"
import { Button } from "reakit"
import * as css from "./close-button.css"

interface CloseButtonProps {
  onClick: () => void
}

export const CloseButton = ({ onClick }: CloseButtonProps) => {
  return (
    <Button className={css.closeButton} onClick={onClick} aria-label="Close">
      X
    </Button>
  )
}
