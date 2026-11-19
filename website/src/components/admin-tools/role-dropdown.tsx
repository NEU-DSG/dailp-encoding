import React from "react"
import { UserGroup } from "src/graphql/dailp"
import * as css from "./role-dropdown.css"

const userRoles: { value: UserGroup; label: string }[] = [
  { value: UserGroup.Readers, label: "Reader" },
  { value: UserGroup.Contributors, label: "Contributor" },
  { value: UserGroup.Editors, label: "Editor" },
  { value: UserGroup.Administrators, label: "Admin" },
]

interface RoleDropdownProps
  extends Omit<React.ComponentProps<"select">, "onChange" | "value"> {
  value: UserGroup
  onChange: (role: UserGroup) => void
}

export const RoleDropdown = ({
  value,
  onChange,
  ...props
}: RoleDropdownProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = userRoles.find((r) => r.value === e.target.value)?.value
    if (role) onChange(role)
  }

  return (
    <select
      {...props}
      className={css.roleSelect}
      value={value}
      onChange={handleChange}
    >
      {userRoles.map((r) => (
        <option key={r.value} value={r.value}>
          {r.label}
        </option>
      ))}
    </select>
  )
}
