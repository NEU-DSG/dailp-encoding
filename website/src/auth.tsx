import { HubCallback } from "@aws-amplify/core"
import Amplify, { Auth, Hub } from "aws-amplify"
import React, { createContext, useContext, useState } from "react"

const UserContext = createContext<CognitoUser | null>(null)

export const UserProvider = (props: { children: any }) => {
  const [user, setUser] = useState<CognitoUser | null>(null)
  React.useEffect(() => {
    Amplify.configure({
      Auth: {
        // TODO How to get these variables from the server?
        region: process.env.DAILP_AWS_REGION,
        userPoolId: process.env.DAILP_USER_POOL,
        userPoolWebClientId: process.env.DAILP_USER_POOL_CLIENT,
      },
    })

    Auth.currentUserPoolUser()
      .then((user) => setUser(user))
      .catch(() => setUser(null))

    const listener: HubCallback = async (data) => {
      switch (data.payload.event) {
        case "signIn":
        case "signUp":
          setUser(await Auth.currentUserPoolUser())
          break
        case "signOut":
          setUser(null)
          break
      }
    }
    Hub.listen("auth", listener)
    return () => Hub.remove("auth", listener)
  }, [])

  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  )
}

export const useCredentials = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("`useUser` must be within a `UserProvider`")
  }
  return context
}

interface CognitoUser {
  signInUserSession: { idToken: { jwtToken: string } }
}
