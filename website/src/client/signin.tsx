import React, { useEffect } from "react"
import Amplify, { Auth } from "aws-amplify"
import { Button } from "../theme"
import { Link } from "gatsby"
import { useCredentials, UserProvider } from "../auth"
import { useCMS } from "tinacms"

const ClientSignIn = () => {
  const creds = useCredentials()
  const cms = useCMS()
  useEffect(() => {
    if (creds) {
      cms.enable()
    } else {
      cms.disable()
    }
  }, [creds])
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
