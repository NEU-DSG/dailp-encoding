import React, { useEffect, useRef, useState } from "react"
import * as styles from "./dropdown-nav-item.css"
import { DropdownToggle } from "./dropdown-toggle"

export const DropdownNavItem = (props: {
  label: string
  links: { text: string; href: string }[]
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <li ref={ref} className={styles.dropdownContainer}>
      <DropdownToggle
        label={props.label}
        isOpen={open}
        onToggle={() => setOpen(!open)}
      />

      {open && (
        <ul className={styles.dropdownMenu}>
          {props.links.map((link) => (
            <li key={link.text}>
              <a href={link.href} className={styles.dropdownItem}>
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
