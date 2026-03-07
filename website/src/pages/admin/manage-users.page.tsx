import React from "react"
import { UserRole } from "src/auth"
import { AuthGuard } from "src/components/auth-guard"
import { ListHeader } from "src/components/dashboard/list-header"
import { UserList } from "src/components/user-management/user-list"
import Layout from "src/layout"

const ManageUsersPage = () => {
  return (
    <AuthGuard requiredRole={UserRole.Editor || UserRole.Admin}>
      <Layout>
        <main>
          <h1>User Management</h1>
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
