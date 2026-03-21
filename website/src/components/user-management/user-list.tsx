import React, { useState } from "react"
import { Input } from "reakit"
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

type ActiveDialog =
  | { kind: "confirmRoleChange"; user: User; newRole: UserGroup }
  | { kind: "confirmDelete"; user: User }
  | { kind: "roleChangeSuccess"; displayName: string; newRoleLabel: string }
  | { kind: "deleteSuccess"; displayName: string }
  | { kind: "bulkEdit"; role: UserGroup }

export const UserList = () => {
  const [{ data, fetching, error }, reloadUsers] = useAllUsersQuery()
  const [updateUserResult, updateUser] = useUpdateUserMutation()
  const [deleteUserResult, deleteUser] = useDeleteUserMutation()
  const [query, setQuery] = useState("")
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
  const [activeDialog, setActiveDialog] = useState<ActiveDialog | null>(null)

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
    setActiveDialog({ kind: "confirmRoleChange", user, newRole })
  }

  const confirmRoleChange = (user: User, newRole: UserGroup) => {
    updateUser({
      user: {
        id: user.id,
        displayName: user.displayName || "",
        role: newRole,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        location: user.location,
        organization: user.organization,
      },
    })
    setActiveDialog({
      kind: "roleChangeSuccess",
      displayName: user.displayName || "Unknown user",
      newRoleLabel: getRoleLabel(newRole),
    })
  }

  const handleRemoveUser = (user: User) => {
    // katie todo: connect to aws after rust update
    setActiveDialog({ kind: "confirmDelete", user })
  }

  const confirmDeleteUser = (user: User) => {
    deleteUser({ userId: user.id }).then(() =>
      reloadUsers({ requestPolicy: "network-only" })
    )
    setActiveDialog({
      kind: "deleteSuccess",
      displayName: user.displayName || "Unknown user",
    })
  }

  // katie todo: stub, how to determine if invitation has been accepted?
  const getPendingInviteStatus = (user: User): JSX.Element => {
    const isPendingInvite = true

    if (isPendingInvite) {
      return <span style={{ color: "#999" }}>(Pending)</span>
    } else return <></>
  }

  const toggleUserSelected = (userId: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) {
        next.delete(userId)
      } else {
        next.add(userId)
      }
      return next
    })
  }

  const renderUserRows = (users: ReadonlyArray<User>) =>
    users.map((user) => (
      <div key={user.id} className={css.userRow}>
        <input
          type="checkbox"
          className={css.checkboxCell}
          checked={selectedUserIds.has(user.id)}
          onChange={() => toggleUserSelected(user.id)}
        />
        <div className={css.usernameCell}>
          {user.displayName || "Email not found"}
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
        <div className={css.queryContainer}>
          <button
            className={css.updateButton}
            onClick={() =>
              selectedUserIds.size > 0 &&
              setActiveDialog({ kind: "bulkEdit", role: UserGroup.Readers })
            }
          >
            Edit Selected Users
          </button>
          <Input
            className={css.queryInput}
            value={query}
            placeholder="Search users..."
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {fetching ? (
          <>Loading...</>
        ) : error ? (
          <>Error loading users</>
        ) : !data || !data.listUsers.length ? (
          <>No users found.</>
        ) : (
          <div className={css.scrollable}>
            {renderUserRows(
              data.listUsers.filter((u) =>
                (u.displayName ?? "")
                  .toLowerCase()
                  .includes(query.toLowerCase())
              )
            )}
          </div>
        )}
      </main>
      {activeDialog?.kind === "confirmRoleChange" && (
        <ConfirmationDialog
          isOpen
          onClose={() => setActiveDialog(null)}
          onConfirm={() =>
            confirmRoleChange(activeDialog.user, activeDialog.newRole)
          }
          title="Change User Permissions?"
          subtitle="Changes have been made to the user(s) below:"
        >
          <p>
            <span className={css.dialogUsername}>
              {activeDialog.user.displayName || "Unknown user"}
            </span>{" "}
            will be updated to{" "}
            <span className={css.dialogRole}>
              {getRoleLabel(activeDialog.newRole)}
            </span>
            .
          </p>
        </ConfirmationDialog>
      )}
      {activeDialog?.kind === "confirmDelete" && (
        <ConfirmationDialog
          isOpen
          onClose={() => setActiveDialog(null)}
          onConfirm={() => confirmDeleteUser(activeDialog.user)}
          title="Remove This User?"
          subtitle="You are about to remove the following user:"
        >
          <p className={css.dialogUsername}>
            {activeDialog.user.displayName || "Unknown user"}
          </p>
        </ConfirmationDialog>
      )}
      {activeDialog?.kind === "roleChangeSuccess" && (
        <EmptyDialog
          isOpen
          onClose={() => setActiveDialog(null)}
          title="User Roles Updated"
          subtitle="An email confirmation has been sent to the user(s) below:"
        >
          <p>
            <span className={css.dialogUsername}>
              {activeDialog.displayName}
            </span>{" "}
            has been updated to a{" "}
            <span className={css.dialogRole}>{activeDialog.newRoleLabel}</span>.
          </p>
        </EmptyDialog>
      )}
      {activeDialog?.kind === "deleteSuccess" && (
        <EmptyDialog
          isOpen
          onClose={() => setActiveDialog(null)}
          title="User Removed"
          subtitle="An email confirmation has been sent to:"
        >
          <p className={css.dialogUsername}>{activeDialog.displayName}</p>
        </EmptyDialog>
      )}
      {activeDialog?.kind === "bulkEdit" && (
        <ConfirmationDialog
          isOpen
          onClose={() => setActiveDialog(null)}
          onConfirm={() => setActiveDialog(null)}
          title="Make Changes?"
          subtitle={`The following users are affected: ${
            data?.listUsers
              .filter((u) => selectedUserIds.has(u.id))
              .map((u) => u.displayName || "Unknown user")
              .join(", ") ?? ""
          }`}
        >
          <p>
            Role:{" "}
            <RoleDropdown
              value={activeDialog.role}
              onChange={(role) => setActiveDialog({ kind: "bulkEdit", role })}
            />
          </p>
        </ConfirmationDialog>
      )}
    </>
  )
}
