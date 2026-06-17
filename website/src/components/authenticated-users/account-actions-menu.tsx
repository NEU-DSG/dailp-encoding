import React from "react"
import * as Dailp from "src/graphql/dailp"
import { ConfirmLogout } from "src/pages/auth/user-auth-layout"
import Link from "../link/link"
import * as css from "./account-menu.css"

export const AccountActionsMenu = (p: {
  groups?: readonly Dailp.UserGroup[]
}) => {
  let actions = [<Link href="/dashboard">Dashboard</Link>, <ConfirmLogout />]
  let groups: string[] =
    p.groups && p.groups.length > 0
      ? p.groups.map((x) => x.toLowerCase().slice(0, x.length - 1))
      : ["Reader"]

  return (
    <div className={css.accountMenuPopover}>
      <span className={css.accountInfo}>
        Your roles
        <ul>
          {groups.map((group) => (
            <li className={css.accountMenuListItem}>{group}</li>
          ))}
        </ul>
      </span>
      <ol className={css.accountMenuActions}>
        {actions.map((action) => (
          <li className={css.accountMenuListItem}>{action}</li>
        ))}
      </ol>
    </div>
  )
}
