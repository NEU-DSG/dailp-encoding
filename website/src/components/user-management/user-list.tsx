import React from "react"
import { Helmet } from "react-helmet"
import { useAllUsersQuery } from "src/graphql/dailp"
import { boldWordRow, wordRow } from "../../pages/timeline.css"

export const UserList = () => {
  const [{ data, fetching, error }] = useAllUsersQuery()

  return (
    <>
      <Helmet title="Users" />
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
                <div>Role: {user.role}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
