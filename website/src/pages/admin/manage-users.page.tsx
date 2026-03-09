import React from "react"
import { UserRole } from "src/auth"
import { AuthGuard } from "src/components/auth-guard"
import { ListHeader } from "src/components/dashboard/list-header"
import { UserList } from "src/components/user-management/user-list"
import Layout from "src/layout"
import { fullWidth } from "src/style/utils.css"

const ManageUsersPage = () => {
  return (
    <AuthGuard requiredRole={UserRole.Editor || UserRole.Admin}>
      <Layout>
        <main>
          <div className={css.}>
          <header className={fullWidth}>
                    <h1>User Management</h1>
                  </header>
          <button style={{ 
              position: "absolute",
              right: 0,
              width: "138px",
              height: "38px"
            }}>Add User</button>
        </div>
          <ListHeader label="Current Users" />

          <div>
            <UserList />
          </div>
        </main>
      </Layout>
    </AuthGuard>
  )
}

export const Page = ManageUsersPage
