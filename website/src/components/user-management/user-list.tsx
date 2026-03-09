import React from "react"
import { AllUsersQuery, UserGroup, useAllUsersQuery } from "src/graphql/dailp"
import * as css from "./user-list.css"

const userRoles = [
  { value: UserGroup.Readers, label: "Reader" },
  { value: UserGroup.Contributors, label: "Contributor" },
  { value: UserGroup.Editors, label: "Editor" },
  { value: UserGroup.Administrators, label: "Admin" },
] as const

export const UserList = () => {
  const [{ data, fetching, error }] = useAllUsersQuery()
  const handleRoleChange = (userId: string, newRole: string) => {
    // katie todo: connect to aws after rust update
  }

  const handleRemoveUser = (userId: string, displayName: string) => {
    // katie todo: connect to aws after rust update
  }

  // katie todo: stub, how to determine if invitation has been accepted?
  const getPendingStatus = (
    user: AllUsersQuery["listUsers"][number]
  ): JSX.Element => {
    const isPending = true

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
          <div>
            {data.listUsers.map((user) => (
              <div key={user.id} className={css.userRow}>
                <div>{user.displayName || "Email not found"}</div>
                <div>
                  Role:{" "}
                  <select
                    value={user.role || UserGroup.Readers}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    {userRoles.map((item) => (
                      <option key={item.value} value={item.value}>
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
