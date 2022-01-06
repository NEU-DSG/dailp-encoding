import Amplify, { Auth } from "aws-amplify"
import React, { useEffect } from "react"
import { useCMS } from "tinacms"
import { Button } from "src/components"
import Link from "src/components/link"
import { UserProvider, useCredentials } from "../auth"

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
    return <Link href="/signin">Sign In</Link>
  }
}

export default () => (
  <UserProvider>
    <ClientSignIn />
  </UserProvider>
)
