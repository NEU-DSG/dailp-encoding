import React from "react"
import * as css from "./submit-button.css"

interface SubmitButtonProps {
  onClick?: () => void
  type?: "submit" | "button"
  children?: React.ReactNode
}

export const SubmitButton = ({
  onClick,
  type = "button",
  children = "Submit",
}: SubmitButtonProps) => {
  return (
    <button type={type} onClick={onClick} className={css.submitButton}>
      {children}
    </button>
  )
}
