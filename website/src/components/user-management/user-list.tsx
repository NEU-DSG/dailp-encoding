import React from "react"
import { Helmet } from "react-helmet"
import { UserGroup, useAllUsersQuery } from "src/graphql/dailp"
import { boldWordRow, wordRow } from "../../pages/timeline.css"

const userRoles = [
  UserGroup.Administrators,
  UserGroup.Editors,
  UserGroup.Contributors,
  UserGroup.Readers,
] as const

export const UserList = () => {
  const [{ data, fetching, error }] = useAllUsersQuery()
  const handleRoleChange = (userId: string, newRole: string) => {
    // katie todo: connect to aws after rust update
  }

  const handleRemoveUser = (userId: string, displayName: string) => {
    // katie todo: connect to aws after rust update
  }

  return (
    <>
      <main>
        {fetching ? (
          <>Loading...</>
        ) : error ? (
          <>Error loading users!</>
        ) : !data || !data.listUsers.length ? (
          <>No users found.</>
        ) : (
          <div>
            {data.listUsers.map((user) => (
              <div key={user.id} className={wordRow}>
                <div>{user.displayName}</div>
                <div>
                  Role:{" "}
                  <select
                    value={user.role || UserGroup.Readers}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value as UserGroup)
                    }
                  >
                    {userRoles.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>{/*pending invitation function here*/}</div>
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
