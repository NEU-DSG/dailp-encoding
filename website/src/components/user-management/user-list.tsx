import React, { useState } from "react"
import {
  AllUsersQuery,
  User,
  UserGroup,
  useAllUsersQuery,
  useUpdateUserMutation,
} from "src/graphql/dailp"
import { ConfirmationDialog } from "../confirmation-dialog"
import { EmptyDialog } from "../empty-dialog"
import * as css from "./user-list.css"

export const UserList = () => {
  const [{ data, fetching, error }] = useAllUsersQuery()
  const [updateUserResult, updateUser] = useUpdateUserMutation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingUserUpdate, setPendingUserUpdate] = useState<{
    user: User
    newRole: UserGroup
  } | null>(null)

  const userRoles = [
    { value: UserGroup.Readers, label: "Reader" },
    { value: UserGroup.Contributors, label: "Contributor" },
    { value: UserGroup.Editors, label: "Editor" },
    { value: UserGroup.Administrators, label: "Admin" },
  ]
  const roleOptions = userRoles.map((item) => (
    <option key={item.label} value={item.value}>
      {item.label}
    </option>
  ))

  const handleRoleChange = (user: User, newRole: UserGroup) => {
    if (!newRole) return

    setPendingUserUpdate({ user, newRole })
    setDialogOpen(true)
  }

  const confirmRoleChange = () => {
    if (!pendingUserUpdate) return

    const userUpdate = {
      id: pendingUserUpdate.user.id,
      displayName: pendingUserUpdate.user.displayName || "",
      role: pendingUserUpdate.newRole,
      avatarUrl: pendingUserUpdate.user.avatarUrl,
      bio: pendingUserUpdate.user.bio,
      location: pendingUserUpdate.user.location,
      organization: pendingUserUpdate.user.organization,
    }

    updateUser({ user: userUpdate })
    setDialogOpen(false)
    setPendingUserUpdate(null)
  }

  const cancelRoleChange = () => {
    setDialogOpen(false)
    setPendingUserUpdate(null)
  }

  const handleRemoveUser = (userId: string, displayName: string) => {
    // katie todo: connect to aws after rust update
  }

  const handleAddUser = (userId: string, displayName: string) => {
    // katie todo: connect to aws after rust update
  }

  // katie todo: stub, how to determine if invitation has been accepted?
  const getPendingInviteStatus = (user: User): JSX.Element => {
    const isPendingInvite = false

    if (isPendingInvite) {
      return <span style={{ color: "#999" }}>(Pending)</span>
    } else return <></>
  }

  const getRoleLabel = (role: UserGroup) => {
    return userRoles.find((r) => r.value === role)?.label || ""
  }

  const renderUserRows = (users: ReadonlyArray<User>) =>
    users.map((user) => (
      <div key={user.id} className={css.userRow}>
        <div>{user.displayName || "Email not found"}</div>
        <div>
          Role:{" "}
          <select
            value={user.role || UserGroup.Readers}
            onChange={(e) => {
              const role = userRoles.find(
                (r) => r.value === e.target.value
              )?.value
              if (role) handleRoleChange(user, role)
            }}
          >
            {roleOptions}
          </select>
        </div>
        <div>{getPendingInviteStatus(user)}</div>
        <div>
          <button>Remove User</button>
        </div>
      </div>
    ))

  return (
    <>
      <main>
        {fetching ? (
          <>Loading...</>
        ) : error ? (
          <>Error loading users</>
        ) : !data || !data.listUsers.length ? (
          <>No users found.</>
        ) : (
          <div className={css.scrollable}>{renderUserRows(data.listUsers)}</div>
        )}
      </main>
      {pendingUserUpdate && (
        <ConfirmationDialog
          isOpen={dialogOpen}
          onClose={cancelRoleChange}
          onConfirm={confirmRoleChange}
          title="Change User Permissions?"
          subtitle="Changes have been made to the user(s) below:"
        >
          <p>
            {pendingUserUpdate.user.displayName || "Unknown user"} will be
            updated to {getRoleLabel(pendingUserUpdate.newRole)}.
          </p>
        </ConfirmationDialog>
      )}
    </>
  )
}
