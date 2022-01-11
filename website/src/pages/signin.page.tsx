import React from "react"

/* import { withAuthenticator, AmplifySignIn } from "@aws-amplify/ui-react" */

/* import { useCredentials } from "../auth" */
import Layout from "../layout"

const SignInPage = () => (
  <Layout>
    <main>
      <SignIn />
    </main>
  </Layout>
)
export default SignInPage

const SignIn = () => <p>Already signed in</p>

/* const SignIn = withAuthenticator(() => {
 *   const creds = useCredentials()
 *   if (creds) {
 *     // Redirect to profile page?
 *     return <p>Already signed in</p>
 *   } else {
 *     return <AmplifySignIn />
 *   }
 * }) */
