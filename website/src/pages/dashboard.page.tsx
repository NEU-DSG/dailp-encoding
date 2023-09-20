import React from "react"
import { Dashboard } from "src/components/dashboard"
import LayoutDashboard from "../layout-dashboard"


const DashboardPage = () => {
  return (
    <LayoutDashboard>
      <Dashboard />
    </LayoutDashboard>
  )
}
export const Page = DashboardPage
