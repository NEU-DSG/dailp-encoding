import React, { useContext, useEffect, useState, createContext } from "react"
import Amplify, { Auth, Hub } from "aws-amplify"
import { HubCallback } from "@aws-amplify/core"

const UserContext = createContext(null)

export const UserProvider = (props: { children: any }) => {
  const [user, setUser] = useState(null)
  React.useEffect(() => {
    Amplify.configure({
      Auth: {
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
