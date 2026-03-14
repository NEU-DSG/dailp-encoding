import React, { useState } from "react"
import {
  AllUsersQuery,
  User,
  UserGroup,
  useAllUsersQuery,
  useUpdateUserMutation,
} from "src/graphql/dailp"
import * as css from "./user-list.css"
import { EmptyDialog } from "../empty-dialog"
import { ConfirmationDialog } from "../confirmation-dialog"

export const UserList = () => {
  const [{ data, fetching, error }] = useAllUsersQuery()
  const [updateUserResult, updateUser] = useUpdateUserMutation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingUpdate, setPendingUpdate] = useState<{
    user: AllUsersQuery["listUsers"][number]
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

  const handleRoleChange = (
    user: AllUsersQuery["listUsers"][number],
    newRole: UserGroup
  ) => {
    if (!newRole) return

    setPendingUpdate({ user, newRole })
    setDialogOpen(true)
  }

   const confirmRoleChange = () => {
    if (!pendingUpdate) return

    const userUpdate = {
      id: pendingUpdate.user.id,
      displayName: pendingUpdate.user.displayName || "",
      role: pendingUpdate.newRole,
      avatarUrl: null,
      bio: null,
      location: null,
      organization: null,
    }

    updateUser({ user: userUpdate })
    setDialogOpen(false)
    setPendingUpdate(null)
  }

  const cancelRoleChange = () => {
    setDialogOpen(false)
    setPendingUpdate(null)
  }

  const handleRemoveUser = (userId: string, displayName: string) => {
    // katie todo: connect to aws after rust update
  }

  const handleAddUser = (userId: string, displayName: string) => {
    // katie todo: connect to aws after rust update
  }

  // katie todo: stub, how to determine if invitation has been accepted?
  const getPendingStatus = (
    user: AllUsersQuery["listUsers"][number]
  ): JSX.Element => {
    const isPending = false

    if (isPending) {
      return <span style={{ color: "#999" }}>(Pending)</span>
    } else return <></>
  }

  const getRoleLabel = (role: UserGroup) => {
    return userRoles.find(r => r.value === role)?.label || ""
  }



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
          <div className={css.scrollable}>
            {data.listUsers.map((user) => (
              <div key={user.id} className={css.userRow}>
                <div>{user.displayName || "Email not found"}</div>
                <div>
                  Role:{" "}
                  <select
                    value={user.role || UserGroup.Readers}
                    onChange={(e) => {
                      {
                        const role = userRoles.find(
                          (r) => r.value === e.target.value
                        )?.value
                        if (role) handleRoleChange(user, role)
                      }
                    }}
                  >
                    {roleOptions}
                  </select>
                </div>
                <div>{getPendingStatus(user)}</div>
                <div>
                  <button>Remove User</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {pendingUpdate && (
  <ConfirmationDialog
    isOpen={dialogOpen}
    onClose={cancelRoleChange}
    onConfirm={confirmRoleChange}
    title="Change User Permissions?"
    subtitle="Changes have been made to the user(s) below:"
  >
    <p>
      {pendingUpdate.user.displayName || "Unknown user"} will be updated to{" "}
      {getRoleLabel(pendingUpdate.newRole)}.
    </p>
  </ConfirmationDialog>
)}
    </>
  )
}
