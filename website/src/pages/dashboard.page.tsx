import React from "react"
import { Dashboard } from "src/components/dashboard/dashboard"
import LayoutDashboard from "../layout-dashboard"

const DashboardPage = () => {
  return (
    <LayoutDashboard>
      <main>
        <Dashboard />
      </main>
    </LayoutDashboard>
  )
}
export const Page = DashboardPage
