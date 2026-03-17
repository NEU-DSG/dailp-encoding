import React, { useState } from "react"
import {
  AllUsersQuery,
  User,
  UserGroup,
  useAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "src/graphql/dailp"
import { ConfirmationDialog } from "../confirmation-dialog"
import { EmptyDialog } from "../empty-dialog"
import { RoleDropdown } from "./role-dropdown"
import * as css from "./user-list.css"

export const UserList = () => {
  const [{ data, fetching, error }, reloadUsers] = useAllUsersQuery()
  const [updateUserResult, updateUser] = useUpdateUserMutation()
  const [deleteUserResult, deleteUser] = useDeleteUserMutation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingUserUpdate, setPendingUserUpdate] = useState<{
    user: User
    newRole: UserGroup
  } | null>(null)
  const [roleUpdateSuccessOpen, setRoleUpdateSuccessOpen] = useState(false)
  const [completedUserUpdate, setCompletedUserUpdate] = useState<{
    displayName: string
    newRoleLabel: string
  } | null>(null)
  const [deleteUserDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pendingDeleteUser, setPendingDeleteUser] = useState<User | null>(null)
  const [removeSuccessOpen, setRemoveSuccessOpen] = useState(false)
  const [removedUserName, setRemovedUserName] = useState<string | null>(null)

  const userRoles = [
    { value: UserGroup.Readers, label: "Reader" },
    { value: UserGroup.Contributors, label: "Contributor" },
    { value: UserGroup.Editors, label: "Editor" },
    { value: UserGroup.Administrators, label: "Admin" },
  ]
  const getRoleLabel = (role: UserGroup) => {
    return userRoles.find((r) => r.value === role)?.label || ""
  }

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
    setCompletedUserUpdate({
      displayName: pendingUserUpdate.user.displayName || "Unknown user",
      newRoleLabel: getRoleLabel(pendingUserUpdate.newRole),
    })
    setDialogOpen(false)
    setPendingUserUpdate(null)
    setRoleUpdateSuccessOpen(true)
  }

  const cancelRoleChange = () => {
    setDialogOpen(false)
    setPendingUserUpdate(null)
  }

  const handleRemoveUser = (user: User) => {
    // katie todo: connect to aws after rust update
    setPendingDeleteUser(user)
    setDeleteDialogOpen(true)
  }

  const cancelDeleteUser = () => {
    setDeleteDialogOpen(false)
    setPendingDeleteUser(null)
  }
  const confirmDeleteUser = () => {
    if (!pendingDeleteUser) return
    const displayName = pendingDeleteUser.displayName || "Unknown user"
    deleteUser({ userId: pendingDeleteUser.id }).then(() =>
      reloadUsers({ requestPolicy: "network-only" })
    )
    cancelDeleteUser()
    setRemovedUserName(displayName)
    setRemoveSuccessOpen(true)
  }

  // katie todo: stub, how to determine if invitation has been accepted?
  const getPendingInviteStatus = (user: User): JSX.Element => {
    const isPendingInvite = true

    if (isPendingInvite) {
      return <span style={{ color: "#999" }}>(Pending)</span>
    } else return <></>
  }

  const renderUserRows = (users: ReadonlyArray<User>) =>
    users.map((user) => (
      <div key={user.id} className={css.userRow}>
        <div className={css.usernameCell}>
          {user.displayName || "Error: Email not found"}
        </div>
        <div className={css.roleCell}>
          Role:{" "}
          <RoleDropdown
            value={user.role || UserGroup.Readers}
            onChange={(role) => handleRoleChange(user, role)}
          />
        </div>
        <div className={css.pendingCell}>{getPendingInviteStatus(user)}</div>
        <div className={css.removeCell}>
          <button onClick={() => handleRemoveUser(user)}>Remove User</button>
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
      {pendingDeleteUser && (
        <ConfirmationDialog
          isOpen={deleteUserDialogOpen}
          onClose={cancelDeleteUser}
          onConfirm={confirmDeleteUser}
          title="Remove This User?"
          subtitle="You are about to remove the following user:"
        >
          <p>{pendingDeleteUser.displayName || "Unknown user"}</p>
        </ConfirmationDialog>
      )}
      {completedUserUpdate && (
        <EmptyDialog
          isOpen={roleUpdateSuccessOpen}
          onClose={() => {
            setRoleUpdateSuccessOpen(false)
            setCompletedUserUpdate(null)
          }}
          title="User Roles Updated"
          subtitle="An email confirmation has been sent to the user(s) below:"
        >
          <p>
            {completedUserUpdate.displayName} has been updated to a{" "}
            {completedUserUpdate.newRoleLabel}.
          </p>
        </EmptyDialog>
      )}
      {removedUserName && (
        <EmptyDialog
          isOpen={removeSuccessOpen}
          onClose={() => {
            setRemoveSuccessOpen(false)
            setRemovedUserName(null)
          }}
          title="User Removed"
          subtitle="An email confirmation has been sent to:"
        >
          <p>{removedUserName}</p>
        </EmptyDialog>
      )}
    </>
  )
}
