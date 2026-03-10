import React from "react"
import { UserRole } from "src/auth"
import { AuthGuard } from "src/components/auth-guard"
import { ListHeader } from "src/components/dashboard/list-header"
import { UserList } from "src/components/user-management/user-list"
import Layout from "src/layout"
import { fullWidth } from "src/style/utils.css"
import * as css from "../../components/user-management/user-list.css"

const ManageUsersPage = () => {
  return (
    <AuthGuard requiredRole={UserRole.Editor || UserRole.Admin}>
      <Layout>
        <main>
          <div className={css.headerContainer}>
            <header className={fullWidth}>
              <h1>User Management</h1>
            </header>
            <button className={css.addButton}>+ Add User</button>
          </div>
          <ListHeader>Current Users</ListHeader>

          <div>
            <UserList />
          </div>
        </main>
      </Layout>
    </AuthGuard>
  )
}

export const Page = ManageUsersPage
