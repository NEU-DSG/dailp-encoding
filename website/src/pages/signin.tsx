import React from "react"
import { withAuthenticator, AmplifySignIn } from "@aws-amplify/ui-react"
import { useCredentials } from "../auth"
import Layout from "../layout"

export default () => (
  <Layout>
    <main>
      <SignIn />
    </main>
  </Layout>
)

const SignIn = withAuthenticator(() => {
  const creds = useCredentials()
  if (creds) {
    // Redirect to profile page?
    return null
  } else {
    return <AmplifySignIn />
  }
})
