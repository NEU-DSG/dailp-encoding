import React from "react"
import * as css from "./dashboard.css"

export const ListHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css.dashboardTabs}>
      <span
        className={css.dashboardTab}
        style={{ cursor: "default", textAlign: "center" }}
      >
        {children}
      </span>
    </div>
  )
}
