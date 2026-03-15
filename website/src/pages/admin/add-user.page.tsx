import React from "react"
import { UserRole } from "src/auth"
import { AuthGuard } from "src/components/auth-guard"
import Layout from "src/layout"
import * as css from "./add-user.css"

const AddUserPage = () => {
  return (
    <AuthGuard requiredRole={UserRole.Editor || UserRole.Admin}>
      <Layout>
        <main>
          <div>
            <header>
              <h1>Add User</h1>
            </header>
          </div>
        </main>
      </Layout>
    </AuthGuard>
  )
}

export const Page = AddUserPage
