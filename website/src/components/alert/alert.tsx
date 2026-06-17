import React from "react"
import * as css from "./alert.css"

export const Alert = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css.wrapper}>
      <div className={css.notice} role="alert">
        <p>{children}</p>
      </div>
    </div>
  )
}
