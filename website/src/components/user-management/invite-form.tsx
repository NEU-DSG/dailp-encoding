import React, { useState } from "react"
import { Label } from "src/components"
import { CancelButton } from "src/components/cancel-button"
import { CloseButton } from "src/components/close-button"
import { EmptyDialog } from "src/components/empty-dialog"
import { SubmitButton } from "src/components/submit-button"
import { UserGroup, useAddUserMutation } from "src/graphql/dailp"
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
  const [, addUser] = useAddUserMutation()
  const [successOpen, setSuccessOpen] = useState(false)
  const [submittedUsers, setSubmittedUsers] = useState<UserEntry[]>([])

  const roleLabel = (role: UserGroup) => {
    const labels: Record<UserGroup, string> = {
      [UserGroup.Readers]: "Reader",
      [UserGroup.Contributors]: "Contributor",
      [UserGroup.Editors]: "Editor",
      [UserGroup.Administrators]: "Admin",
    }
    return labels[role] ?? role
  }

  const handleSubmit = (entries: UserEntry[]) => {
    entries.map((user) => addUser({ displayName: user.email, role: user.role }))
    setSubmittedUsers(entries)
    setSuccessOpen(true)
  }

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
                <CloseButton
                  onClick={() => removeUser(index)}
                  className={css.rowCloseButtonOffset}
                />
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
        <SubmitButton type="submit" onClick={() => handleSubmit(users)} />
      </div>

      <EmptyDialog
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="User Successfully Added"
        subtitle="An email invitation has been sent to the user(s) below:"
      >
        {submittedUsers.map((user, index) => (
          <p key={index}>
            {user.email} has been added to the site as a {roleLabel(user.role)}.
          </p>
        ))}
      </EmptyDialog>
    </>
  )
}
