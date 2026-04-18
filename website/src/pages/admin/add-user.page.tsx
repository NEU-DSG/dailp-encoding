import React from "react"
import { UserRole } from "src/auth"
import { AuthGuard } from "src/components/auth-guard"
import { InviteForm } from "src/components/user-management/invite-form"
import Layout from "src/layout"
import * as css from "./add-user.css"

const requiredMark = <span style={{ color: "#9f4d43" }}>*</span>

const AddUserPage = () => {
  return (
    <AuthGuard requiredRole={UserRole.Editor || UserRole.Admin}>
      <Layout>
        <main>
          <h1 className={css.pageHeader}>Add User(s)</h1>
          <p className={css.subtitle}>
            {requiredMark} indicates a required field
          </p>

          <InviteForm />
        </main>
      </Layout>
    </AuthGuard>
  )
}

export const Page = AddUserPage
