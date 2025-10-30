import {
  AuthenticationDetails,
  CognitoIdToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js"
import React, { createContext, useContext, useEffect, useState } from "react"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserGroup } from "./graphql/dailp"
import { jwtDecode } from 'jwt-decode'
import { getUserSessionAsync, useCognitoAuthOperations } from "./auth-cognito"
import { roleToGroups, useDailpAuthOperations } from "./auth-dailp"

export type AuthUser = 
  | { type: 'cognito', user: CognitoUser }
  | { type: 'dailp', userId: string, email: string, groups: UserGroup[] }

const AUTH_MODE = process.env["AUTH_MODE"] || 'cognito'

type UserContextType = {
  user: AuthUser | null
  isAuthLoading: boolean
  operations: {
    createUser: (username: string, password: string) => void
    resetConfirmationCode: (email: string) => void
    confirmUser: (email: string, confirmationCode: string) => void
    loginUser: (username: string, password: string) => void
    resetPassword: (username: string) => void
    changePassword: (verificationCode: string, newPassword: string) => void
    signOutUser: () => void
  }
}

const UserContext = createContext<UserContextType>({} as UserContextType)

const userPool = new CognitoUserPool({
  UserPoolId: process.env["DAILP_USER_POOL"] ?? "",
  ClientId: process.env["DAILP_USER_POOL_CLIENT"] ?? "",
})

// Needed for localStorage access issue in SSR environment
const LocalStorage =
  typeof window !== "undefined"
    ? window.localStorage
    : { getItem: () => null, setItem: () => {} }

/** Get the currently signed in user, if there is one. */
export function getCurrentUser(): AuthUser | null {
  if (AUTH_MODE === 'cognito') {
    const cognitoUser = userPool.getCurrentUser()
    return cognitoUser ? { type: 'cognito', user: cognitoUser } : null
  } else {
    const token = LocalStorage.getItem('dailp_access_token')
    if (!token) return null
    const decodedToken = jwtDecode<{ sub: string, email: string, role: string, exp: number }>(token)
    return { 
      type: 'dailp',
      userId: decodedToken["sub"],
      email: decodedToken["email"],
      groups: decodedToken["role"] ? [decodedToken["role"].toUpperCase() as UserGroup] : []
    }
  }
}

export const UserProvider = (props: { children: any }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (AUTH_MODE === 'cognito') {
      console.log("Initializing UserProvider in Cognito Auth mode")
      const cognitoUser = userPool.getCurrentUser()
      return cognitoUser ? { type: 'cognito', user: cognitoUser } : null
    } else {
      console.log("Initializing UserProvider in DAILP Auth mode")
      const token = LocalStorage.getItem('dailp_access_token')
      if (!token) return null
      try {
        const decoded = jwtDecode<{ sub: string, email: string, role: string }>(token)
        return {
          type: 'dailp',
          userId: decoded.sub,
          email: decoded.email,
          groups: roleToGroups(decoded.role)
        }
      } catch (err) {
        console.error('Failed to decode token for UserProvider initialisation:', err)
        return null
      }
    }
  })
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  // Create operation handlers based on AUTH_MODE
  const cognitoOps = useCognitoAuthOperations(userPool, setUser)
  const dailpOps = useDailpAuthOperations(setUser)
  const ops = AUTH_MODE === 'cognito' ? cognitoOps : dailpOps

  useEffect(() => {
    if (user != null) {
      // User is logged in, set up refresh
      if (user.type === 'cognito') {
        cognitoOps.setupTokenRefresh(user.user).then(() => setIsAuthLoading(false))
      } else {
        dailpOps.setupTokenRefresh().then(() => setIsAuthLoading(false))
      }
    } else {
      // User is null, but check if expired token exists
      if (AUTH_MODE === 'dailp') {
        const token = LocalStorage.getItem('dailp_access_token')
        if (token) {
          // Expired token exists, setupTokenRefresh will handle it
          dailpOps.setupTokenRefresh().then(() => setIsAuthLoading(false))
        } else {
          // No token, user is truly logged out
          setIsAuthLoading(false)
        }
      } else {
        setIsAuthLoading(false)
      }
    }
  }, [user])

  // // Token refresh logic
  // useEffect(() => {
  //   if (user != null) {
  //     if (user.type === 'cognito') {
  //       // Cognito refresh logic
  //       cognitoOps.setupTokenRefresh(user.user).then(() => setIsAuthLoading(false))
  //     } else {
  //       // DAILP refresh logic
  //       dailpOps.setupTokenRefresh().then(() => setIsAuthLoading(false))
  //     }
  //   } else {
  //     setIsAuthLoading(false)
  //   }
  // }, [user])

  function createUser(email: string, password: string) {
    ops.createUser(email, password)
  }

  function resetConfirmationCode(email: string) {
    ops.resetConfirmationCode(email)
  }

  function confirmUser(email: string, confirmationCode: string) {
    ops.confirmUser(email, confirmationCode)
  }

  function loginUser(username: string, password: string) {
    ops.loginUser(username, password)
  }

  function resetPassword(username: string) {
    ops.resetPassword(username)
  }

  function changePassword(verificationCode: string, newPassword: string) {
    if (user?.type === 'cognito') {
        cognitoOps.changePassword(user.user, verificationCode, newPassword)
    } else {
        dailpOps.changePassword(verificationCode, newPassword)
    }
  }

  function signOutUser() {
    if (user?.type === 'cognito') {
        cognitoOps.signOutUser(user.user)
    } else {
        dailpOps.signOutUser()
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthLoading,
        operations: {
          createUser,
          resetConfirmationCode,
          confirmUser,
          loginUser,
          resetPassword,
          changePassword,
          signOutUser,
        },
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  return context
}

export const useAuthLoading = () => {
  const context = useContext(UserContext)
  return context.isAuthLoading
}

export const useCredentials = () => {
  const context = useContext(UserContext)
  if (!context.user) return null
  
  if (context.user.type === 'cognito') {
    return context.user.user.getSignInUserSession()?.getIdToken().getJwtToken() ?? null
  } else {
    return LocalStorage.getItem('dailp_access_token')
  }
}

export const useUserGroups = (): UserGroup[] => {
  const { user } = useContext(UserContext)
  if (!user) return []
  
  if (user.type === 'cognito') {
    const groups: string[] =
    user.user?.getSignInUserSession()?.getIdToken().payload["cognito:groups"] ?? []
  return   groups
    .map((g) => g.toUpperCase())
    .filter((g): g is UserGroup =>
      Object.values(UserGroup).includes(g as UserGroup)
    )
  } else {
    return user.groups
  }
}

/**
 * A user has one and only one `role`. A role is typically a users most
 * permissive `group`, or `READER` if they have no `groups`.
 */
export enum UserRole {
  Reader = "READER",
  Contributor = "CONTRIBUTOR",
  Editor = "EDITOR",
  Admin = "ADMIN",
}

export function useUserRole(): UserRole {
  const groups = useUserGroups()
  if (groups.includes(UserGroup.Editors)) return UserRole.Editor
  else if (groups.includes(UserGroup.Contributors)) return UserRole.Contributor
  else return UserRole.Reader
}

export const useUserId = () => {
  const { user } = useContext(UserContext)
  if (!user) return null
  
  if (user.type === 'cognito') {
    return user.user.getSignInUserSession()?.getIdToken().payload["sub"] ?? null
  } else {
    return user.userId
  }
}

/**
 * Get the user's ID token object (Cognito mode only).
 * For new code, use getAuthToken() instead.
 */
export async function getIdToken(): Promise<CognitoIdToken | null> {
  const user = getCurrentUser() as unknown as CognitoUser
  if (!user) return null
  const sess = await getUserSessionAsync(user)
  return sess?.getIdToken() ?? null
}

/**
 * Get the user's auth token as a JWT string.
 * Works in both Cognito and DAILP modes.
 */
export async function getAuthToken(): Promise<string | null> {
  if (process.env["AUTH_MODE"] === 'dailp') {
    // DAILP mode
    return LocalStorage.getItem('dailp_access_token')
  } else {
    // Cognito mode
    const idToken = await getIdToken()
    return idToken?.getJwtToken() ?? null
  }
}