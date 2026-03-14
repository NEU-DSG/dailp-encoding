import React from "react"
import * as css from "./list-header.css"

export const ListHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css.listHeaderContainer}>
      <span className={css.listHeaderTab}>{children}</span>
    </div>
  )
}
