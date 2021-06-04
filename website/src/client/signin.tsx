import React, { useEffect } from "react"
import Amplify, { Auth } from "aws-amplify"
import { Button } from "../theme"
import { Link } from "gatsby"
import { useCredentials, UserProvider } from "../auth"

const ClientSignIn = () => {
  const creds = useCredentials()
  if (creds) {
    return <Button onClick={() => Auth.signOut()}>Sign Out</Button>
  } else {
    return <Link to="/signin">Sign In</Link>
  }
}

export default () => (
  <UserProvider>
    <ClientSignIn />
  </UserProvider>
)
