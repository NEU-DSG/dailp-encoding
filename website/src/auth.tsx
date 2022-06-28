import { HubCallback } from "@aws-amplify/core"
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js"
import Amplify, { Auth, Hub } from "aws-amplify"
import React, { createContext, useContext, useEffect, useState } from "react"

type UserContextType = {
  user: CognitoUser | null
  setUser: (user: CognitoUser | null) => void
  operations: {
    loginUser: (username: string, password: string) => void
  }
}

const UserContext = createContext<UserContextType>({} as UserContextType)

export const userPool = new CognitoUserPool({
  UserPoolId: process.env["DAILP_USER_POOL"] ?? "",
  ClientId: process.env["DAILP_USER_POOL_CLIENT"] ?? "",
})

export const UserProvider = (props: { children: any }) => {
  const [user, setUser] = useState<CognitoUser | null>(
    userPool.getCurrentUser()
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
        console.log("Login success. Result: ", data)
        alert("Login successful")
        setUser(user)
      },
      onFailure: (data: CognitoUserSession) => {
        console.error("Login failed. Result: ", data)
        alert("Login failed")
      },
      newPasswordRequired: (data: CognitoUserSession) => {
        console.log("New password required. Result: ", data)
        alert("New password is required")
      },
    })
  }

  return (
    <UserContext.Provider value={{ user, setUser, operations: { loginUser } }}>
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
