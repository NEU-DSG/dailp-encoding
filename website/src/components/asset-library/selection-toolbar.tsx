import React from "react"
import { MdClose } from "react-icons/md/index"
import { CleanButton } from "src/components"
import * as css from "./asset-library.css"

interface SelectionToolbarProps {
  count: number
  onClear: () => void
  onRename: () => void
  onMove: () => void
}

export const SelectionToolbar = (p: SelectionToolbarProps) => (
  <div className={css.selectionToolbar} role="group" aria-label="Selection">
    <CleanButton
      type="button"
      className={css.dismissButton}
      onClick={p.onClear}
      disabled={p.count === 0}
      aria-label="Clear selection"
      title="Clear selection"
    >
      <MdClose size={20} />
    </CleanButton>
    <span className={css.selectionCount}>{p.count} selected</span>

    <CleanButton
      type="button"
      className={css.selectionAction}
      onClick={p.onRename}
      disabled={p.count !== 1}
    >
      Rename
    </CleanButton>
    <CleanButton
      type="button"
      className={css.selectionAction}
      onClick={p.onMove}
      disabled={p.count === 0}
    >
      Move
    </CleanButton>
  </div>
)
