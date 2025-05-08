import React from "react"
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
