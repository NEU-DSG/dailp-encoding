import React from "react"
import { UserRole, useAuthLoading, useUser, useUserRole } from "src/auth"
import Layout from "src/layout"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  fallback?: React.ReactNode
}

/**
 * A reusable auth guard component that handles loading states and role-based access control.
 * Use this instead of duplicating auth logic across pages.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRoles,
  fallback,
}) => {
  const { user } = useUser()
  const isAuthLoading = useAuthLoading()
  const userRole = useUserRole()

  // Show loading while auth is being determined
  if (isAuthLoading) {
    return (
      <Layout>
        <main>
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
            }}
          >
            <p>Loading...</p>
          </div>
        </main>
      </Layout>
    )
  }

  // If no user and no fallback, redirect to login
  if (!user) {
    if (fallback) {
      return <>{fallback}</>
    }
    // You could redirect to login here if needed
    return (
      <Layout>
        <main>
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
            }}
          >
            <p>Please log in to access this page.</p>
          </div>
        </main>
      </Layout>
    )
  }

  // Check role requirements
  const hasRequiredRole =
    !requiredRoles ||
    requiredRoles.length === 0 ||
    (userRole !== undefined && requiredRoles.includes(userRole))

  if (!hasRequiredRole) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <Layout>
        <main>
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <h1>Access Denied</h1>
            <p>
              You need {requiredRoles!.join(", ")} permissions to access this
              page. Please contact an administrator if you believe you should
              have access.
            </p>
          </div>
        </main>
      </Layout>
    )
  }

  return <>{children}</>
}
