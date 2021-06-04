import React from "react"
import Amplify, { Auth } from "aws-amplify"
import { Button } from "../theme"
import { Link } from "gatsby"
import { useCredentials } from "../auth"

const ClientSignIn = () => {
  const creds = useCredentials()
  if (creds) {
    return <Button onClick={() => Auth.signOut()}>Sign Out</Button>
  } else {
    return (
      <Button as={Link} to="/signin">
        Sign In
      </Button>
    )
  }
}
export default ClientSignIn

Amplify.configure({
  Auth: {
    region: process.env.AWS_REGION,
    userPoolId: process.env.DAILP_USER_POOL,
    userPoolWebClientId: process.env.DAILP_USER_POOL_CLIENT,
  },
})
