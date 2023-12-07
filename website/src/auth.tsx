import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js"
import React, { createContext, useContext, useEffect, useState } from "react"
import { navigate } from "vite-plugin-ssr/client/router"

type UserContextType = {
  user: CognitoUser | null
  operations: {
    createUser: (username: string, password: string) => void
    resetConfirmationCode: () => void
    confirmUser: (confirmationCode: string) => void
    loginUser: (username: string, password: string) => void
    resetPassword: (username: string) => void
    changePassword: (verificationCode: string, newPassword: string) => void
  }
}

const UserContext = createContext<UserContextType>({} as UserContextType)

const userPool = new CognitoUserPool({
  UserPoolId: process.env["DAILP_USER_POOL"] ?? "",
  ClientId: process.env["DAILP_USER_POOL_CLIENT"] ?? "",
})

export const UserProvider = (props: { children: any }) => {
  const [user, setUser] = useState<CognitoUser | null>(
    // gets the last user that logged in via this user pool
    userPool.getCurrentUser()
  )

  function refreshToken(): Promise<CognitoUserSession | null> {
    if (!user) return Promise.resolve(null)
    return new Promise((res, rej) => {
      // getSession() refreshes last authenticated user's tokens
      user.getSession(function (err: Error, result: CognitoUserSession | null) {
        if (err) rej(err)
        return res(result)
      })
    })
  }

  // Allows persistence of the current user's session between browser refreshes.
  useEffect(() => {
    // if there is an authenticated user present
    if (user != null) {
      const promise = refreshToken().then((result) => {
        if (!result) return null
        const intervalLength =
          result.getAccessToken().getExpiration() * 1000 - Date.now()
        const handle = window.setInterval(() => refreshToken(), intervalLength)
        return handle
      })
      return () => {
        promise.then((handle) => {
          if (handle) {
            window.clearInterval(handle)
          }
        })
      }
    }

    return
  }, [user])

  function createUser(email: string, password: string) {
    console.log(`requesting adding user ${email} to Cognito User Pool`)
    let userAttributes = [{ Name: "email", Value: email }].map((attr) => {
      return new CognitoUserAttribute(attr)
    })
    userPool.signUp(
      email,
      password,
      userAttributes,
      [],
      async (err, result) => {
        if (err) {
          alert(err.message || JSON.stringify(err))
          return
        }
        let cognitoUser = result?.user
        if (!cognitoUser) {
          console.log("failed to create user and activate session")
          return
        }
        setUser(cognitoUser)
        await navigate("/auth/confirm-signup")
      }
    )
  }

  function resetConfirmationCode() {
    user?.resendConfirmationCode((err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err))
        return
      }
      console.log(result)
    })
  }

  function confirmUser(confirmationCode: string) {
    user?.confirmRegistration(confirmationCode, false, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err))
        return
      }
      console.log(result)
      setUser(user)
      navigate("/auth/login")
    })
  }

  function loginUser(username: string, password: string) {
    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    })

    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    })

    // logs in the user with the authentication details
    user.authenticateUser(authDetails, {
      onSuccess: (data: CognitoUserSession) => {
        setUser(user)

        console.log("Login success. Result: ", data)
        alert("Login successful")
        navigate("/") // TODO navigate to dashboard
      },
      onFailure: (err: Error) => {
        console.log("Login failed. Result: ", err)
        alert(err.message)
      },
      newPasswordRequired: (data: CognitoUserSession) => {
        console.log("New password required. Result: ", data)
        alert("New password is required")
      },
    })
  }

  function resetPassword(username: string) {
    // instantiate a new user with the given credentials to access Cognito API methods
    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    })

    user.forgotPassword({
      onSuccess: (data: CognitoUserSession) => {
        setUser(user) // set current user, since a reset password flow was initialized
        console.log("Reset password successful. Result: ", data)
        alert("Reset email successfully sent")
      },
      onFailure: (err: Error) => {
        console.log("Reset password unsuccessful. Result: ", err)
        alert(err.message)
      },
    })
  }

  function changePassword(verificationCode: string, newPassword: string) {
    user?.confirmPassword(verificationCode, newPassword, {
      async onSuccess(data: string) {
        setUser(null) // since user successfully changed password, reset current user's state
        await navigate("/auth/login")

        console.log("Change password successful. Result: ", data)
        alert("Password successfully changed")
      },
      onFailure(err: Error) {
        console.log("Change password unsuccessful. Result: ", err)
        alert(err.message)
      },
    })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        operations: {
          createUser,
          resetConfirmationCode: resetConfirmationCode,
          confirmUser: confirmUser,
          loginUser,
          resetPassword,
          changePassword,
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

// returns a jwt token
export const useCredentials = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error("`useUser` must be within a `UserProvider`")
  }

  // gets the jwt token of the currently signed in user
  const creds = context.user?.getSignInUserSession()?.getIdToken().getJwtToken()

  return creds ?? null
}

export const useCognitoUserGroups = () => {
  const { user } = useContext(UserContext)
  const groups: string[] =
    user?.getSignInUserSession()?.getIdToken().payload["cognito:groups"] ?? []
  return groups
}

export enum UserRole {
  READER = "READER",
  CONTRIBUTOR = "CONTRIBUTOR",
  EDITOR = "EDITOR",
}

export function useUserRole(): UserRole {
  const groups = useCognitoUserGroups()
  if (groups.includes("Editors")) return UserRole.EDITOR
  else if (groups.includes("Contributors")) return UserRole.CONTRIBUTOR
  else return UserRole.READER
}

export const useUserId = () => {
  const { user } = useContext(UserContext)
  const sub: string | null =
    user?.getSignInUserSession()?.getIdToken().payload["sub"] ?? null
  return sub
}

function getUserSessionAsync(
  user: CognitoUser
): Promise<CognitoUserSession | null> {
  return new Promise((res, _rej) => {
    user.getSession(function (err: Error, result: CognitoUserSession | null) {
      res(result)
    })
  })
}

/**
 * Plain old function to get credentials. If at all possible, use a hook for this.
 */
export async function getCredentials() {
  const user = userPool.getCurrentUser()
  if (!user) return null

  const sess = await getUserSessionAsync(user)
  const token = sess?.getIdToken().getJwtToken()
  return token ?? null
}
