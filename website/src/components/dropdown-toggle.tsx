import * as styles from "./dropdown-toggle.css"

export const DropdownToggle = ({
  label,
  isOpen,
  onToggle,
}: {
  label: string
  isOpen: boolean
  onToggle: () => void
}) => {
  return (
    <button
      className={`${styles.dropdownToggle} ${isOpen ? "open" : ""}`}
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      
    <span className={styles.toggleText}>{label}</span>
    <span
      className={styles.toggleIcon}
      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      ▼
    </span>
  </button>

  )
}