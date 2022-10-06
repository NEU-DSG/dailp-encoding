import React from "react"
import { BsArrowBarLeft, BsArrowBarRight } from "react-icons/bs"
import { IconButton } from "src/components"
import Tox1, { TOC } from "src/components/toc.page"
import * as css from "./toc-sidebar.css"

// Renders a sidebar on the left side of the screen that displays a table of contents.
const TOCSidebar = (p: {
  isOpen: boolean
  setIsOpen: (bool: boolean) => void
}) => {
  return (
    // If the sidebar is open, give its container more space in the flexbox.
    <div style={{ flex: p.isOpen ? 2 : 1 }}>
      <nav className={css.sidebar}>
        {/* TOC Header  */}
        <div className={css.tocHeader}>
          {p.isOpen ? (
            // If the panel is open, table of contents header and a button to close.
            // NOTE: The close button will not appear on mobile.
            <>
              <div style={{ paddingLeft: "1rem" }}>Table of Contents</div>
              <IconButton
                onClick={() => {
                  p.setIsOpen(false)
                }}
                aria-label="Dismiss Table of Contents Panel"
              >
                <BsArrowBarLeft size={24} color="#E2E2E2" />
              </IconButton>
            </>
          ) : (
            // If the panel is closed, show a button to open.
            <IconButton
              onClick={() => {
                p.setIsOpen(true)
              }}
              aria-label="Open Table of Contents Panel"
            >
              <BsArrowBarRight size={24} color="#E2E2E2" />
            </IconButton>
          )}
        </div>
        {/* If the panel is open, show the chapters content. */}
        {p.isOpen && <TOC slug="cwkw" />}
      </nav>
    </div>
  )
}

export default TOCSidebar
