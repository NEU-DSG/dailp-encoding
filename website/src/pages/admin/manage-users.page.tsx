import React from "react"
import { UserRole } from "src/auth"
import { AuthGuard } from "src/components/auth-guard"
import Layout from "src/layout"

const ManageUsersPage = () => {
  return (
    <AuthGuard requiredRole={UserRole.Editor || UserRole.Admin}>
      <Layout>
        <main>
          <h1>User Management</h1>

          <div>
            <h2>Update Permissions</h2>
            <p>Manage roles and permissions for existing users.</p>
            {/*add user permissions form/table here */}
          </div>

          <div>
            <h2>Manage Teams</h2>
            <p>View and manage team membership.</p>
            {/*add team management UI here */}
          </div>
        </main>
      </Layout>
    </AuthGuard>
  )
}

export const Page = ManageUsersPage
