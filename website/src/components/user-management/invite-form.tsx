import React, { useState } from "react"
import { Label } from "src/components"
import {
  UserGroup,
  useAddUserMutation,
  useAllUsersQuery,
} from "src/graphql/dailp"
import {
  CancelButton,
  CloseButton,
  ConfirmationDialog,
  EmptyDialog,
  RoleDropdown,
  SubmitButton,
} from "./change-dialog"
import * as css from "./invite-form.css"

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
  const [{ data: existingUsersData }] = useAllUsersQuery()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [submittedUsers, setSubmittedUsers] = useState<UserEntry[]>([])
  const [error, setError] = useState<string | null>(null)

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
    const emails = entries.map((u) => u.email)
    const hasDuplicates = emails.some((e, i) => emails.indexOf(e) !== i)
    if (hasDuplicates) {
      setError("Each user must have a unique email address.")
      return
    }
    const existingEmails = (existingUsersData?.listUsers ?? []).map((u) =>
      (u.displayName ?? "").toLowerCase()
    )
    const alreadyExists = emails.filter((e) => existingEmails.includes(e))
    if (alreadyExists.length > 0) {
      return
    }
    setError(null)
    setConfirmOpen(true)
  }

  const confirmSubmit = () => {
    users.map((user) => addUser({ displayName: user.email, role: user.role }))
    setSubmittedUsers(users)
    setConfirmOpen(false)
    setSuccessOpen(true)
  }

  const addAnotherUser = () => {
    setUsers((prev) => [...prev, { ...initialEntry }])
  }

  const updateUser = (index: number, field: keyof UserEntry, value: string) => {
    const normalised = field === "email" ? value.toLowerCase() : value
    const updatedUsers = users.map((user, i) =>
      i === index ? { ...user, [field]: normalised } : user
    )
    setUsers(updatedUsers)

    // katie todo: replace with checking existing emails from aws instead of database
    const existingEmails = (existingUsersData?.listUsers ?? []).map((u) =>
      (u.displayName ?? "").toLowerCase()
    )
    const invalidEmail = updatedUsers.find(
      (u) => u.email && !(u.email.includes("@") && u.email.includes("."))
    )
    const alreadyExists = updatedUsers.find((u) =>
      existingEmails.includes(u.email)
    )
    if (invalidEmail) {
      setError(`${invalidEmail.email} is not a valid email address.`)
    } else if (alreadyExists) {
      setError(`${alreadyExists.email} already exists.`)
    } else {
      setError(null)
    }
  }

  const removeUser = (index: number) => {
    setError(null)
    setUsers((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <>
      {error && <div className={css.errorMessage}>Error: {error}</div>}
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
        <CancelButton href="/admin/manage-users">Go Back</CancelButton>
        <SubmitButton
          type="submit"
          onClick={() => handleSubmit(users)}
          disabled={error !== null}
        />
      </div>

      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmSubmit}
        title="Invite User(s)?"
        subtitle="You are about to send invitations to the following user(s):"
      >
        <div className={users.length > 5 ? css.dialogScrollable : undefined}>
          {users.map((user, index) => (
            <p key={index}>
              <span className={css.dialogUsername}>{user.email}</span> as a{" "}
              <span className={css.dialogRole}>{roleLabel(user.role)}</span>.
            </p>
          ))}
        </div>
      </ConfirmationDialog>

      <EmptyDialog
        isOpen={successOpen}
        onClose={() => window.location.reload()}
        title="User Successfully Added"
        subtitle="An email invitation has been sent to the user(s) below:"
      >
        <div
          className={
            submittedUsers.length > 5 ? css.dialogScrollable : undefined
          }
        >
          {submittedUsers.map((user, index) => (
            <p key={index}>
              <span className={css.dialogUsername}>{user.email}</span> has been
              added to the site as a{" "}
              <span className={css.dialogRole}>{roleLabel(user.role)}</span>.
            </p>
          ))}
        </div>
      </EmptyDialog>
    </>
  )
}
