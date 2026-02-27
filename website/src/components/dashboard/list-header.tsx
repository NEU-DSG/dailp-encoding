import React from "react"
import * as css from "./dashboard.css"

interface ListHeaderProps {
  label: string
}

export const ListHeader = ({ label }: ListHeaderProps) => {
  return (
    <div className={css.dashboardTabs}>
      <span
        className={css.dashboardTab}
        style={{ cursor: "default", textAlign: "center" }}
      >
        {label}
      </span>
    </div>
  )
}
