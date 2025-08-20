import React from "react"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserRole, useUserRole } from "src/auth"
import { Dashboard } from "src/components/dashboard/dashboard"
import Layout from "../layout"

const DashboardPage = () => {
  return (
    <Layout>
      <main>
        <Dashboard />
      </main>
    </Layout>
  )
}
export const Page = DashboardPage
