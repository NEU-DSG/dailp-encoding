import React from "react"
import { Popover, PopoverDisclosure, usePopoverState } from "reakit"
import * as Dailp from "src/graphql/dailp"
import { subtleButton } from "../subtle-button/subtle-button.css"
import { AccountActionsMenu } from "./account-actions-menu"

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
