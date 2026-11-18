import React, { useEffect, useState } from "react"
import { Popover, PopoverDisclosure, usePopoverState } from "reakit"
import { useCredentials, useUser } from "src/auth"
import { Environment, deploymentEnvironment } from "src/env"
import { loginHeader } from "src/pages/auth/user-auth.css"
import { CleanButton } from "../button"
import * as Dailp from "src/graphql/dailp"
import Link from "../link"
import { subtleButton } from "../subtle-button.css"
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


// the login button that appears in the header of the website
export const LoginHeaderButton = (props?: { className?: string }) => {
  // hide the login button on production while development of DAILP TI is ongoing
  // FIXME remove this flag when DAILP TI launches in a stable form
  if (deploymentEnvironment === Environment.Production) {
    return null
  }

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className={loginHeader}>Loading...</div> // or skeleton
  }

  // get the current user's auth token
  const token = useCredentials()

  return (
    <div className={loginHeader}>
      {/* if an auth token exists, that means a user is logged in */}
      {token ? (
        <AccountMenu />
      ) : (
        <Link href="/auth/login" className={props?.className}>
          Log in
        </Link>
      )}
    </div>
  )
}

export const ConfirmLogout = (props?: { className?: string }) => {
  const { operations } = useUser()

  return (
    <CleanButton
      className={props?.className}
      onClick={() => {
        let confirmation = confirm("Are you sure you want to sign out?")
        if (confirmation) operations.signOutUser()
      }}
    >
      Log out
    </CleanButton>
  )
}
