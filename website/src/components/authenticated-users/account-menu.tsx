import React from "react"
import { Popover, PopoverDisclosure, usePopoverState } from "reakit"
import * as Dailp from "src/graphql/dailp"
import { ConfirmLogout } from "src/pages/auth/user-auth-layout"
import Link from "../link"
import { subtleButton } from "../subtle-button/subtle-button.css"
import * as css from "./account-menu.css"

/**
 * Displays a list of actions for a signed in user.
 *
 * Since this component can optionally be used outside of a menu context,
 * its structure follows the ARIA-APG Disclosure Navigation Menu Example.
 * Implemented using Reakit's {@link PopoverDisclosure}.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
 */
export const AccountMenu = () => {
  let menuState = usePopoverState({ gutter: 0, placement: "bottom-start" })
  let [{ data }] = Dailp.useUserInfoQuery()

  return (
    <>
      <PopoverDisclosure {...menuState} className={subtleButton}>
        {data?.userInfo?.email}
      </PopoverDisclosure>
      <Popover {...menuState}>
        <AccountActionsMenu {...data?.userInfo} />
      </Popover>
    </>
  )
}

const AccountActionsMenu = (p: { groups?: readonly Dailp.UserGroup[] }) => {
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
