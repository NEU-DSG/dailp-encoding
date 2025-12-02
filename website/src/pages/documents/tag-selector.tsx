import React, { useState } from "react"
import * as styles from "./tag-selector.css"

interface TagSelectorProps {
  label: string
  selectedTags: string[]
  approvedTags: string[]
  newTags?: Set<string>
  onAdd?: (tag: string) => void
  onRemove?: (index: number) => void
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
    <div className={styles.fullWidthGroup}>
      <label className={styles.label}>{label}</label>

      <div className={styles.tagsContainer}>
        {selectedTags.map((tag, index) => (
          <div
            key={index}
            className={newTags.has(tag) ? styles.newTag : styles.tag}
          >
            <span>{tag}</span>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove?.(index)}
                className={styles.removeTagButton}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className={styles.tagDropdownContainer}>
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className={styles.addTagButton}
        >
          {addButtonLabel}
        </button>

        {showDropdown && (
          <div className={styles.tagDropdown}>
            {customForm ? (
              <>{customForm}</>
            ) : (
              approvedTags
                .filter((tag) => !selectedTags.includes(tag))
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onAdd?.(tag)}
                    className={styles.tagOption}
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
