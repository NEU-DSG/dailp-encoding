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
  | { kind: "confirmBulkRoleChange"; users: User[]; newRole: UserGroup }
  | { kind: "confirmBulkDelete"; users: User[] }
  | { kind: "roleChangeSuccess"; displayName: string; newRoleLabel: string }
  | { kind: "deleteSuccess"; displayName: string }
  | {
      kind: "bulkRoleChangeSuccess"
      displayNames: string[]
      newRoleLabel: string
    }
  | { kind: "bulkDeleteSuccess"; displayNames: string[] }
  | { kind: "bulkEdit"; role: UserGroup | null; deleteAll: boolean }

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

  const selectedUsers =
    data?.listUsers.filter((u) => selectedUserIds.has(u.id)) ?? []

  const applyRoleChange = (user: User, newRole: UserGroup) => {
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
  }

  const applyDeleteUser = (user: User) => {
    deleteUser({ userId: user.id }).then(() =>
      reloadUsers({ requestPolicy: "network-only" })
    )
  }

  const handleRoleChange = (user: User, newRole: UserGroup) => {
    if (!newRole) return
    setActiveDialog({ kind: "confirmRoleChange", user, newRole })
  }

  const confirmRoleChange = (user: User, newRole: UserGroup) => {
    applyRoleChange(user, newRole)
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
    applyDeleteUser(user)
    setActiveDialog({
      kind: "deleteSuccess",
      displayName: user.displayName || "Unknown user",
    })
  }

  const handleBulkEditSelected = (
    users: User[],
    role: UserGroup | null,
    deleteAll: boolean
  ) => {
    if (deleteAll) {
      setActiveDialog({ kind: "confirmBulkDelete", users })
    } else if (role) {
      setActiveDialog({ kind: "confirmBulkRoleChange", users, newRole: role })
    }
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

  const renderRoleChangeSuccess = (
    displayNames: string[],
    newRoleLabel: string
  ) => (
    <EmptyDialog
      isOpen
      onClose={() => setActiveDialog(null)}
      title="User Roles Updated"
      subtitle="An email confirmation has been sent to the user(s) below:"
    >
      {displayNames.map((name) => (
        <p key={name}>
          <span className={css.dialogUsername}>{name}</span> has been updated to
          a <span className={css.dialogRole}>{newRoleLabel}</span>.
        </p>
      ))}
    </EmptyDialog>
  )

  const renderDeleteSuccess = (displayNames: string[]) => (
    <EmptyDialog
      isOpen
      onClose={() => setActiveDialog(null)}
      title="User Removed"
      subtitle="An email confirmation has been sent to:"
    >
      {displayNames.map((name) => (
        <p key={name} className={css.dialogUsername}>
          {name}
        </p>
      ))}
    </EmptyDialog>
  )

  const renderRoleChangeConfirm = (
    users: User[],
    newRole: UserGroup,
    onConfirm: () => void
  ) => (
    <ConfirmationDialog
      isOpen
      onClose={() => setActiveDialog(null)}
      onConfirm={onConfirm}
      title="Change User Permissions?"
      subtitle="Changes have been made to the user(s) below:"
    >
      {users.map((u) => (
        <p key={u.id}>
          <span className={css.dialogUsername}>
            {u.displayName || "Unknown user"}
          </span>{" "}
          will be updated to{" "}
          <span className={css.dialogRole}>{getRoleLabel(newRole)}</span>.
        </p>
      ))}
    </ConfirmationDialog>
  )

  const renderDeleteConfirm = (users: User[], onConfirm: () => void) => (
    <ConfirmationDialog
      isOpen
      onClose={() => setActiveDialog(null)}
      onConfirm={onConfirm}
      title="Remove User(s)?"
      subtitle="You are about to remove the following user(s):"
    >
      {users.map((u) => (
        <p key={u.id} className={css.dialogUsername}>
          {u.displayName || "Unknown user"}
        </p>
      ))}
    </ConfirmationDialog>
  )

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
              setActiveDialog({
                kind: "bulkEdit",
                role: null,
                deleteAll: false,
              })
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
      {activeDialog?.kind === "confirmRoleChange" &&
        renderRoleChangeConfirm([activeDialog.user], activeDialog.newRole, () =>
          confirmRoleChange(activeDialog.user, activeDialog.newRole)
        )}
      {activeDialog?.kind === "confirmDelete" &&
        renderDeleteConfirm([activeDialog.user], () =>
          confirmDeleteUser(activeDialog.user)
        )}
      {activeDialog?.kind === "roleChangeSuccess" &&
        renderRoleChangeSuccess(
          [activeDialog.displayName],
          activeDialog.newRoleLabel
        )}
      {activeDialog?.kind === "deleteSuccess" &&
        renderDeleteSuccess([activeDialog.displayName])}
      {activeDialog?.kind === "bulkEdit" && (
        <ConfirmationDialog
          isOpen
          onClose={() => setActiveDialog(null)}
          onConfirm={() =>
            handleBulkEditSelected(
              selectedUsers,
              activeDialog.role,
              activeDialog.deleteAll
            )
          }
          title="Make Changes?"
          subtitle={`The following users are affected: ${selectedUsers
            .map((u) => u.displayName || "Unknown user")
            .join(", ")}`}
        >
          <p>
            Role:{" "}
            <select
              value={activeDialog.role ?? "none"}
              onChange={(e) => {
                const selected = Object.values(UserGroup).find(
                  (v) => v === e.target.value
                )
                setActiveDialog({
                  kind: "bulkEdit",
                  role: selected ?? null,
                  deleteAll: activeDialog.deleteAll,
                })
              }}
            >
              <option value="none">None</option>
              {userRoles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </p>
          <label>
            <input
              type="checkbox"
              checked={activeDialog.deleteAll}
              onChange={(e) =>
                setActiveDialog({
                  kind: "bulkEdit",
                  role: activeDialog.role,
                  deleteAll: e.target.checked,
                })
              }
            />{" "}
            Delete all selected users
          </label>
        </ConfirmationDialog>
      )}
      {activeDialog?.kind === "confirmBulkRoleChange" &&
        renderRoleChangeConfirm(
          activeDialog.users,
          activeDialog.newRole,
          () => {
            activeDialog.users.forEach((u) =>
              applyRoleChange(u, activeDialog.newRole)
            )
            setActiveDialog({
              kind: "bulkRoleChangeSuccess",
              displayNames: activeDialog.users.map(
                (u) => u.displayName || "Unknown user"
              ),
              newRoleLabel: getRoleLabel(activeDialog.newRole),
            })
          }
        )}
      {activeDialog?.kind === "confirmBulkDelete" &&
        renderDeleteConfirm(activeDialog.users, () => {
          activeDialog.users.forEach(applyDeleteUser)
          setActiveDialog({
            kind: "bulkDeleteSuccess",
            displayNames: activeDialog.users.map(
              (u) => u.displayName || "Unknown user"
            ),
          })
        })}
      {activeDialog?.kind === "bulkRoleChangeSuccess" &&
        renderRoleChangeSuccess(
          activeDialog.displayNames,
          activeDialog.newRoleLabel
        )}
      {activeDialog?.kind === "bulkDeleteSuccess" &&
        renderDeleteSuccess(activeDialog.displayNames)}
    </>
  )
}
