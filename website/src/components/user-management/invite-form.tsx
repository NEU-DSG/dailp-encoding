import React, { useState } from "react"
import { Label } from "src/components"
import { CancelButton } from "src/components/cancel-button"
import { CloseButton } from "src/components/close-button"
import { SubmitButton } from "src/components/submit-button"
import { UserGroup } from "src/graphql/dailp"
import * as css from "./invite-form.css"
import { RoleDropdown } from "./role-dropdown"

export interface UserEntry {
  email: string
  role: UserGroup
}

const initialEntry: UserEntry = {
  email: "",
  role: UserGroup.Readers,
}
const requiredMark = <span style={{ color: "#9f4d43" }}>*</span>

export const InviteForm = () => {
  const [users, setUsers] = useState<UserEntry[]>([initialEntry])
  const [personalMessage, setPersonalMessage] = useState("")

  const addAnotherUser = () => {
    setUsers((prev) => [...prev, { ...initialEntry }])
  }

  const updateUser = (index: number, field: keyof UserEntry, value: string) => {
    setUsers((prev) =>
      prev.map((user, i) => (i === index ? { ...user, [field]: value } : user))
    )
  }

  const removeUser = (index: number) => {
    setUsers((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <>
      {users.map((user, index) => (
        <div key={index} className={css.userFieldsContainer}>
          <div className={css.userFieldsRow}>
            <div className={css.fieldGroup}>
              <Label className={css.fieldLabel} htmlFor={`email-${index}`}>
                User Email{requiredMark}
              </Label>
              <input
                id={`email-${index}`}
                type="email"
                className={css.emailInput}
                value={user.email}
                onChange={(e) => updateUser(index, "email", e.target.value)}
                aria-label={`User email for entry ${index + 1}`}
              />
            </div>

            <div className={css.fieldGroup}>
              <Label className={css.fieldLabel} htmlFor={`role-${index}`}>
                User Role{requiredMark}
              </Label>
              <RoleDropdown
                id={`role-${index}`}
                value={user.role}
                onChange={(role) => updateUser(index, "role", role)}
              />
            </div>

            {index > 0 && (
              <div className={css.rowCloseButton}>
                <CloseButton onClick={() => removeUser(index)} />
              </div>
            )}
          </div>
        </div>
      ))}

      <div className={css.messageContainer}>
        <Label className={css.fieldLabel} htmlFor="personal-message">
          Personal Message
        </Label>
        <textarea
          id="personal-message"
          className={css.messageTextarea}
          value={personalMessage}
          onChange={(e) => setPersonalMessage(e.target.value)}
        />
      </div>

      <div className={css.addAnotherContainer}>
        <button
          type="button"
          className={css.addAnotherButton}
          onClick={addAnotherUser}
        >
          + Add Another User
        </button>
      </div>

      <div className={css.actionButtons}>
        <CancelButton href="/admin/manage-users" />
        <SubmitButton type="submit" />
      </div>
    </>
  )
}
