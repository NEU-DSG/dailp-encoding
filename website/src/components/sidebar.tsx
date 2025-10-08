import "@fontsource/quattrocento-sans/latin.css"
import "normalize.css"
import React, { useEffect } from "react"
import { BsArrowBarLeft, BsArrowBarRight } from "react-icons/bs/index"
import { MdMenu } from "react-icons/md/index"
import { Dialog, DialogBackdrop, DialogDisclosure } from "reakit"
import { drawerBg, navButton } from "src/components/navigation/menu.css"
import CollectionTOC from "src/components/toc"
import { useDialog } from "src/pages/edited-collections/edited-collection-context"
import "src/style/global.css"
import { colors } from "src/style/theme-contract.css"
import * as css from "./sidebar.css"

// Renders a sidebar on the left side of the screen containing a drawer.
export const Sidebar = () => {
  const dialog = useDialog()

  // On load, make sure drawer appears for desktop screens.
  useEffect(() => {
    dialog.setVisible(true)
  }, [])

  return (
    <>
      <Dialog
        {...dialog}
        className={css.drawer}
        as="nav"
        aria-label="Table of Contents"
      >
        <CollectionTOC />
      </Dialog>
      <DialogDisclosure
        {...dialog}
        className={css.desktopNav}
        aria-label="Open Table of Contents"
      >
        {dialog.visible ? (
          <BsArrowBarLeft size={css.iconSize} className={css.openNav} />
        ) : (
          <BsArrowBarRight size={css.iconSize} className={css.closedNav} />
        )}
      </DialogDisclosure>
    </>
  )
}

export default Sidebar

// Displays a mobile sidebar if on smaller screen sizes.
export const MobileSidebar = () => {
  const dialog = useDialog()

  return (
    <>
      <DialogBackdrop {...dialog} className={drawerBg}>
        <Dialog
          {...dialog}
          className={css.drawer}
          as="nav"
          aria-label="Table of Contents"
          preventBodyScroll={true}
        >
          <CollectionTOC />
        </Dialog>
      </DialogBackdrop>
      <DialogDisclosure
        {...dialog}
        className={navButton}
        aria-label="Open Table of Contents"
      >
        <MdMenu size={css.iconSize} color={colors.body} />
      </DialogDisclosure>
    </>
  )
}
