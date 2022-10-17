import "@fontsource/quattrocento-sans/latin.css"
import "normalize.css"
import React from "react"
import { BsArrowBarLeft, BsArrowBarRight } from "react-icons/bs"
import { MdMenu } from "react-icons/md"
import {
  Dialog,
  DialogBackdrop,
  DialogDisclosure,
  useDialogState,
} from "reakit/Dialog"
import { IconButton } from "src/components"
import CollectionTOC from "src/components/toc.page"
import "src/style/global.css"
import { colors } from "src/style/theme-contract.css"
import "../../wordpress.css"
import * as css from "./sidebar.css"

// Renders a sidebar on the left side of the screen.
export const Sidebar = (p: {
  isOpen: boolean
  setIsOpen: (bool: boolean) => void
}) => {
  return p.isOpen ? ( // If the sidebar is open, give its container more space in the flexbox.
    <div style={{ flex: 2 }}>
      <nav className={css.sidebar}>
        <div className={css.header}>
          {/* If the panel is open, table of contents header and a button to
            close. NOTE: The close button will not appear on mobile. */}
          <div className={css.title}>Table of Contents</div>
          <IconButton
            onClick={() => {
              p.setIsOpen(false)
            }}
            aria-label="Dismiss Table of Contents Panel"
          >
            <BsArrowBarLeft size={24} color={colors.primaryText} />
          </IconButton>
        </div>
        <CollectionTOC />
      </nav>
    </div>
  ) : (
    <div style={{ flex: 1 }}>
      <nav className={css.closedSidebar}>
        {/* If the panel is closed, show a button to open. */}
        <IconButton
          onClick={() => {
            p.setIsOpen(true)
          }}
          aria-label="Open Table of Contents Panel"
        >
          <BsArrowBarRight size={24} color={colors.primaryText} />
        </IconButton>
      </nav>
    </div>
  )
}

export default Sidebar

// Displays a mobile sidebar if on smaller screen sizes.
export const MobileSidebar = () => {
  const dialog = useDialogState({ animated: true })

  return (
    <>
      <DialogBackdrop {...dialog} className={css.sidebarDrawerBg}>
        <Dialog
          {...dialog}
          className={css.drawer}
          as="nav"
          aria-label="Table of Contents"
          preventBodyScroll={true}
        >
          <nav className={css.sidebar}>
            <div className={css.header}>
              <div className={css.title}>Table of Contents</div>
            </div>
            <CollectionTOC />
          </nav>
        </Dialog>
      </DialogBackdrop>
      <DialogDisclosure
        {...dialog}
        className={css.sidebarNavButton}
        aria-label="Open Table of Contents Drawer"
      >
        <MdMenu size={32} />
      </DialogDisclosure>
    </>
  )
}
