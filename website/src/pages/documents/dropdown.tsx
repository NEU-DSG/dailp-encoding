import React, { useState } from "react"
import * as styles from "./tag-selector.css"

interface DropdownProps {
  label?: string
  options: string[] // Stores display names, ex. "APA", "MLA", "Chicago" 
  selected: string | null
  setSelected: (value: string) => void // Accepts display name
  addButtonLabel: string
} 

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selected,
  setSelected,
  addButtonLabel,
}) => {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className={styles.fullWidthGroup}>
      <label className={styles.label}>{label}</label>

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
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
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