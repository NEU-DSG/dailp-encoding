import "@fontsource/quattrocento-sans/latin.css"
import cx from "classnames"
import "normalize.css"
import React, { useEffect, useState } from "react"
import { MdMenu } from "react-icons/md/index"
import { Dialog, DialogBackdrop, DialogDisclosure } from "reakit"
import CollectionTOC from "src/components/toc"
import { drawerBg, navButton } from "src/menu.css"
import { useDialog } from "src/pages/edited-collections/edited-collection-context"
import "src/style/global.css"
import { colors } from "src/style/theme-contract.css"
import * as css from "./sidebar.css"

// Renders a sidebar on the left side of the screen containing a drawer.
export const Sidebar = () => {
  // On load, make sure drawer is initially visible and is non-modal for desktop screens.
  const dialog = useDialog()

  // State variable that checks whether this component has loaded in.
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    dialog.setVisible(true)
    dialog.setModal(false)
  }, [])

  useEffect(() => {
    // If this sidebar's dialog has already animated, set the loaded state to true.
    if (dialog.animating) {
      setLoaded(true)
    }
  }, [dialog.visible])

  return (
    <>
      <Dialog
        {...dialog}
        // If the component has already loaded in, display the drawer with transitions.
        className={cx(css.initDrawer, loaded && css.drawer)}
        as="nav"
        aria-label="Table of Contents"
      >
        <CollectionTOC />
      </Dialog>
      <DialogDisclosure
        {...dialog}
        className={cx(css.baseNavButton, !dialog.visible && css.closeNavButton)}
        aria-label="Open Table of Contents"
      >
        <MdMenu size={css.iconSize} />
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
