import React from "react"
import { UserRole } from "src/auth"
import { ManagePages } from "src/components/admin/manage-pages"
import { AuthGuard } from "src/components/auth-guard"
import Layout from "src/layout"
import { edgePadded, fullWidth } from "src/style/utils.css"

const ManagePagesPage = () => {
  return (
    <AuthGuard requiredRole={UserRole.Editor}>
      <Layout>
        <main className={edgePadded}>
          <div className={fullWidth}>
            <ManagePages />
          </div>
        </main>
      </Layout>
    </AuthGuard>
  )
}

export const Page = ManagePagesPage
