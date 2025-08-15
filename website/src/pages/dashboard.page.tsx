import React from "react"
import { Dashboard } from "src/components/dashboard/dashboard"
import Layout from "../layout"
import { useUserRole, UserRole } from "src/auth"
import { navigate } from "vite-plugin-ssr/client/router"

const DashboardPage = () => {
  const userRole = useUserRole()
  
  // Show loading state while determining user role
  if (userRole === undefined) {
    return (
      <Layout>
        <main>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p>Loading...</p>
          </div>
        </main>
      </Layout>
    )
  }
  
  return (
    <Layout>
      <main>
        {userRole === UserRole.Editor && (
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderBottom: '1px solid #dee2e6',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>Collection Management</h2>
              <button
                onClick={() => navigate('/collections/new')}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>+</span>
                Create New Collection
              </button>
            </div>
          </div>
        )}
        <Dashboard />
      </main>
    </Layout>
  )
}
export const Page = DashboardPage
