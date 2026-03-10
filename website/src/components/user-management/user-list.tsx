import React from "react"
import {
  AllUsersQuery,
  User,
  UserGroup,
  useAllUsersQuery,
  useUpdateUserMutation,
} from "src/graphql/dailp"
import * as css from "./user-list.css"

export const UserList = () => {
  const [{ data, fetching, error }] = useAllUsersQuery()
  const [updateUserResult, updateUser] = useUpdateUserMutation()

  const userRoles = [
    { value: UserGroup.Readers, label: "Reader" },
    { value: UserGroup.Contributors, label: "Contributor" },
    { value: UserGroup.Editors, label: "Editor" },
    { value: UserGroup.Administrators, label: "Admin" },
  ]

  const handleRoleChange = (
    user: AllUsersQuery["listUsers"][number],
    newRole: UserGroup
  ) => {
    const confirm = window.confirm(
      "Press confirm to change user's role to " + newRole
    )

    if (!newRole) return

    if (!confirm) {
      return
    }

    const userUpdate = {
      id: user.id,
      displayName: user.displayName || "",
      role: newRole,
      avatarUrl: null,
      bio: null,
      location: null,
      organization: null,
    }

    updateUser({ user: userUpdate })
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
    const isPending = user

    if (isPending) {
      return <span style={{ color: "#999" }}>(Pending)</span>
    } else return <></>
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
                    {userRoles.map((item) => (
                      <option key={item.label} value={item.value}>
                        {item.label}
                      </option>
                    ))}
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
    </>
  )
}
