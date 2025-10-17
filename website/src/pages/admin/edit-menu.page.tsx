import React from "react"
import { UserRole } from "src/auth"
import { AuthGuard } from "src/components/auth-guard"
import { EditableNavMenu } from "src/components/editable/EditNavMenu"
import Layout from "src/layout"

const EditMenuPage = () => {
  // dennis todo : change required role to admin
  // dennis todo: fetch current menu id from db or whatever so we can edit that version

  return (
    <>
      <AuthGuard requiredRole={UserRole.Editor}>
        <Layout>
          <main>
            <h1> Edit menu page</h1>
            <EditableNavMenu navMenuSlug="default-nav" />
          </main>
        </Layout>
      </AuthGuard>
    </>
  )
}

export const Page = EditMenuPage
