import React from "react"
import { BsArrowBarLeft, BsArrowBarRight } from "react-icons/bs"
import { HiOutlineBookOpen, HiOutlineChevronRight } from "react-icons/hi"
import {
  Dialog,
  DialogBackdrop,
  DialogDisclosure,
  useDialogState,
} from "reakit/Dialog"
import { IconButton } from "src/components"
import * as css from "./toc-sidebar.css"

// Renders a sidebar on the left side of the screen that displays a table of contents.
const TOCSidebar = (p: {
  isOpen: boolean
  setIsOpen: (bool: boolean) => void
  isDesktop: boolean
}) => {
  const dialog = useDialogState({ animated: true })

  const desktopPanel = (
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
        {p.isOpen && <Chapters />}
      </nav>
    </div>
  )

  const mobilePanel = (
    <>
      <DialogBackdrop {...dialog} className={css.tocDrawerBg}>
        <Dialog
          {...dialog}
          className={css.tocDrawer}
          as="nav"
          aria-label="Table of Contents"
          preventBodyScroll={true}
        >
          <nav className={css.sidebar}>
            <div className={css.tocHeader}>
              <div>Table of Contents</div>
            </div>
            <Chapters />
          </nav>
        </Dialog>
      </DialogBackdrop>

      <DialogDisclosure
        {...dialog}
        className={css.tocMobileButton}
        as={IconButton}
        aria-label="Open Table of Contents Panel"
      >
        <HiOutlineBookOpen size={32} color="#E2E2E2" />
      </DialogDisclosure>
    </>
  )

  return <>{p.isDesktop ? desktopPanel : mobilePanel}</>
}

// TOC chapters content
export const Chapters = () => {
  // Placeholder for intro chapters.
  const introChapters = [
    { title: "Preface to Cherokees Writing the Keetoowah Way" },
    { title: "Acknowledgements" },
  ]

  // Placeholder for main chapters.
  const mainChapters = [
    { title: "Stories", author: "Carly Dou" },
    { title: "Governance Documents", author: "John Doe" },
  ]

  return (
    <>
      <ol type="i" className={css.list}>
        {introChapters.map((chapter, index) => (
          <li key={index} className={css.listItem}>
            {/* Chapter title */}
            <div className={css.listItemContent}>
              <div className={css.chapterTitle}>{chapter.title}</div>

              {/* Arrow navigation button */}
              <IconButton aria-label={`Open ${chapter.title}`}>
                <HiOutlineChevronRight size={22} color="#7D7D7D" />
              </IconButton>
            </div>
          </li>
        ))}
      </ol>
      <ol className={css.list}>
        {mainChapters.map((chapter, index) => (
          <li key={index} className={css.listItem}>
            {/* Chapter title */}
            <div className={css.listItemContent}>
              <div className={css.chapterTitle}>{`${chapter.title},
                  ${chapter.author}`}</div>

              {/* Arrow navigation button */}
              <IconButton aria-label={`Open ${chapter.title}`}>
                <HiOutlineChevronRight size={22} color="#7D7D7D" />
              </IconButton>
            </div>
          </li>
        ))}
      </ol>
    </>
  )
}

export default TOCSidebar
