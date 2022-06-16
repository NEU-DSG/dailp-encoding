import { HubCallback } from "@aws-amplify/core"
import Amplify, { Auth, Hub } from "aws-amplify"
import React, { createContext, useContext, useState } from "react"

import {
  CognitoUser,
} from 'amazon-cognito-identity-js'

type UserContextType = {
  user: CognitoUser | null;
  setUser: (value: CognitoUser | null) => void;
};

export const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = (props: { children: any }) => {
  const [user, setUser] = useState<CognitoUser | null>(null);

  // React.useEffect(() => {
  // Amplify.configure({
  //   Auth: {
  //     // TODO How to get these variables from the server?
  //     region: process.env["DAILP_AWS_REGION"],
  //     userPoolId: process.env["DAILP_USER_POOL"],
  //     userPoolWebClientId: process.env["DAILP_USER_POOL_CLIENT"],
  //   },
  // })

  // Auth.currentUserPoolUser()
  //   .then((user) => setUser(user))
  //   .catch(() => setUser(null))

  //   const listener: HubCallback = async (data) => {
  //     switch (data.payload.event) {
  //       case "signIn":
  //         setUser(userPool.getCurrentUser());
  //       case "signUp":
  //       // setUser(await Auth.currentUserPoolUser())
  //       // break
  //       case "signOut":
  //         setUser(null)
  //         break
  //     }
  //   }
  //   Hub.listen("auth", listener)
  //   return () => Hub.remove("auth", listener)
  // }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  )
}

// returns a jwt token
export const useCredentials = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("`useUser` must be within a `UserProvider`")
  }

  // gets the jwt token of the current signed in user
  const creds = context.user?.getSignInUserSession()?.getIdToken().getJwtToken();

  if (context.user === undefined || creds === undefined) {
    console.log("`User is undefined`");
  }

  return creds;
}