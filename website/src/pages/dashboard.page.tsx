import React from "react"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserRole, useUserRole } from "src/auth"
import { Dashboard } from "src/features/dashboard/components/dashboard"
import Layout from "../layout"

const DashboardPage = () => {
  const userRole = useUserRole()

  // Show loading state while determining user role
  if (userRole === undefined) {
    return (
      <Layout>
        <main>
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p>Loading...</p>
          </div>
        </main>
      </Layout>
    )
  }

  return (
    <Layout>
      <main>
        <Dashboard />
      </main>
    </Layout>
  )
}
export const Page = DashboardPage
