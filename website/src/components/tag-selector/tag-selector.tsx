import React, { useState } from "react"
import * as css from "./tag-selector.css"

interface TagSelectorProps {
  label: string
  selectedTags: string[]
  approvedTags: string[]
  newTags?: Set<string>
  onAdd: (tag: string) => void
  onRemove: (index: number) => void
  addButtonLabel: string
  customForm?: React.ReactNode
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  label,
  selectedTags,
  approvedTags,
  newTags = new Set(),
  onAdd,
  onRemove,
  addButtonLabel,
  customForm,
}) => {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className={css.fullWidthGroup}>
      <label className={css.label}>{label}</label>

      <div className={css.tagsContainer}>
        {selectedTags.map((tag, index) => (
          <div key={index} className={newTags.has(tag) ? css.newTag : css.tag}>
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className={css.removeTagButton}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className={css.tagDropdownContainer}>
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className={css.addTagButton}
        >
          {addButtonLabel}
        </button>

        {showDropdown && (
          <div className={css.tagDropdown}>
            {customForm ? (
              <>{customForm}</>
            ) : (
              approvedTags
                .filter((tag) => !selectedTags.includes(tag))
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onAdd(tag)}
                    className={css.tagOption}
                  >
                    {tag}
                  </button>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TagSelector
