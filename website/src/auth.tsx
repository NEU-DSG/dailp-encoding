import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js"
import React, { createContext, useContext, useEffect, useState } from "react"

type UserContextType = {
  user: CognitoUser | null
  setUser: (user: CognitoUser | null) => void
  authenticated: boolean
  setAuthenticated: (newState: boolean) => void
  operations: {
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
  const [authenticated, setAuthenticated] = useState(false)

  const [user, setUser] = useState<CognitoUser | null>(
    authenticated ? userPool.getCurrentUser() : null
  )

  // refreshes last authenticated user
  useEffect(() => {
    if (user != null) {
      user.getSession(function (err: Error, result: CognitoUserSession | null) {
        if (result) {
          console.log("You are now logged in.")
        }
      })
    }
  }, [])

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
        setAuthenticated(true)

        console.log("Login success. Result: ", data)
        alert("Login successful")
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
    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    })

    user.forgotPassword({
      onSuccess: (data: CognitoUserSession) => {
        setUser(user)
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
      onSuccess(data: string) {
        setUser(null)
        window.location.href = "/login" // redirect to login page
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
        setUser,
        authenticated,
        setAuthenticated,
        operations: { loginUser, resetPassword, changePassword },
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

  // gets the jwt token of the current signed in user
  const creds = context.user?.getSignInUserSession()?.getIdToken().getJwtToken()

  return creds ?? null
}
