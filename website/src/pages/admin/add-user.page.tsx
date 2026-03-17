import React, { useState } from "react"
import { UserRole } from "src/auth"
import { Label, Link } from "src/components"
import { AuthGuard } from "src/components/auth-guard"
import { RoleDropdown } from "src/components/user-management/role-dropdown"
import { UserGroup } from "src/graphql/dailp"
import Layout from "src/layout"
import * as css from "./add-user.css"

const initialEntry = { email: "", role: UserGroup.Readers, personalMessage: "" }

const requiredMark = <span style={{ color: "#9f4d43" }}>*</span>

const AddUserPage = () => {
  const [users, setUsers] = useState<typeof initialEntry[]>([initialEntry])

  const addAnotherUser = () => {
    setUsers((prev) => [...prev, { ...initialEntry }])
  }

  const updateUser = (
    index: number,
    field: keyof typeof initialEntry,
    value: string
  ) => {
    setUsers((prev) =>
      prev.map((user, i) => (i === index ? { ...user, [field]: value } : user))
    )
  }

  return (
    <AuthGuard requiredRole={UserRole.Editor || UserRole.Admin}>
      <Layout>
        <main>
          <h1 className={css.pageHeader}>Add User(s)</h1>
          <p className={css.subtitle}>
            {requiredMark} indicates a required field
          </p>

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
              </div>

              <div className={css.messageContainer}>
                <Label
                  className={css.fieldLabel}
                  htmlFor={`personal-message-${index}`}
                >
                  Personal Message
                </Label>
                <textarea
                  id={`personal-message-${index}`}
                  className={css.messageTextarea}
                  value={user.personalMessage}
                  onChange={(e) =>
                    updateUser(index, "personalMessage", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

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
            <Link href="/admin/manage-users">
              <button type="button" className={css.cancelButton}>
                Cancel
              </button>
            </Link>
            <button type="submit" className={css.submitButton}>
              Submit
            </button>
          </div>
        </main>
      </Layout>
    </AuthGuard>
  )
}

export const Page = AddUserPage
