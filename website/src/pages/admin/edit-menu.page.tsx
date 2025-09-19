import React from "react"
import { UserRole } from "src/auth"
import { AuthGuard } from "src/components/auth-guard"
import Layout from "src/layout"
import { NavMenu } from "src/menu"

const EditMenuPage = () => {
  // todo : change required role to admin
  return (
    <>
        <AuthGuard requiredRole={UserRole.Editor}>
      <Layout>
        <main>

<h1> Edit menu page</h1>
<NavMenu menuID={2}/>



        </main>
      </Layout>
        </AuthGuard>
    </>
  )
}

export const Page = EditMenuPage
