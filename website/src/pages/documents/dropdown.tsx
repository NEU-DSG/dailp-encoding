import React, { useState } from "react"
import * as styles from "./tag-selector.css"

interface DropdownProps {
  label?: string
  options: string[] // Stores display names, ex. "APA", "MLA", "Chicago"
  selected: string | null
  setSelected: (value: string) => void // Accepts display name
  addButtonLabel: string
  disabled?: boolean
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selected,
  setSelected,
  addButtonLabel,
  disabled = false, // Default
}) => {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className={styles.fullWidthGroup}>
      <label className={styles.label}>{label}</label>

      <div className={styles.tagDropdownContainer}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (disabled) return // Prevent dropdown from opening
            setShowDropdown(!showDropdown)
          }}
          className={styles.addTagButton}
        >
          {addButtonLabel}
        </button>

        {showDropdown &&
          !disabled && ( // Don’t show list if disabled
            <div className={styles.tagDropdown}>
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return
                    setSelected(opt) // Returns the display name
                    setShowDropdown(false)
                  }}
                  className={styles.tagOption}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}

export default Dropdown
