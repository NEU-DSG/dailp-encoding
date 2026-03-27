import React from "react"
import * as css from "./submit-button.css"

interface SubmitButtonProps {
  onClick?: () => void
  type?: "submit" | "button"
  children?: React.ReactNode
  disabled?: boolean
}

export const SubmitButton = ({
  onClick,
  type = "button",
  children = "Submit",
  disabled,
}: SubmitButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={css.submitButton}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
