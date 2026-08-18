import React from "react"
import { Helmet } from "react-helmet"
import { UserRole } from "src/auth"
import { AuthGuard } from "src/components/auth-guard"

interface CollectionAuthGuardProps {
  children: React.ReactNode
  isHidden: boolean
  fallback?: React.ReactNode
}

export const CollectionAuthGuard: React.FC<CollectionAuthGuardProps> = ({
  children,
  isHidden,
  fallback,
}) => {
  if (!isHidden) return <>{children}</>

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <AuthGuard
        requiredRoles={[UserRole.Editor, UserRole.Contributor]}
        fallback={fallback}
      >
        {children}
      </AuthGuard>
    </>
  )
}
