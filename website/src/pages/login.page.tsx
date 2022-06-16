import React, { FormEvent, useContext, useState } from "react"
import { centeredColumn } from "src/sprinkles.css"
import { centeredForm, loginFormBox, loginHeader, positionButton, skinnyWidth, submitButton } from "./login.css"
import Layout from "../layout"
import Link from "src/components/link"
import { UserContext } from "src/auth"

import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js'

const userPool = new CognitoUserPool({
  UserPoolId: process.env["DAILP_USER_POOL"] ?? "",
  ClientId: process.env["DAILP_USER_POOL_CLIENT"] ?? "",
});

const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // gets the user and its setUser from the context, to update info on the current user
  const context = useContext(UserContext);

  function submitLogin(e: FormEvent<HTMLFormElement>, username: string, password: string) {
    e.preventDefault();

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
      onSuccess: (data) => {
        console.log('Login success. Result: ', data);
        alert("Login successful");

        context.setUser(user);
      },
      onFailure: (data) => {
        console.error('Login failed. Result: ', data);
        alert("Login failed");
      },
      newPasswordRequired: (data) => {
        console.log('New password required. Result: ', data);
        alert("New password is required");
      }
    });

  }

  return (<Layout>
    <main className={skinnyWidth}>
      <header>
        <h1 className={centeredColumn}>Login to Your Account</h1>
        <h4>Login to contribute to the archive by transcribing documents, recording pronunciations, providing cultural commentary, and more.</h4>
      </header>

      <form className={centeredForm} onSubmit={e => submitLogin(e, email, password)}>
        <div >
          <label>
            Email *</label>
          <input
            className={loginFormBox}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="mail@website.com" />
        </div>

        <div>
          <label>
            Password *</label>
          <input
            className={loginFormBox}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="enter password" />
        </div>

        {/* TODO: */}
        <div>
          <label>
            Forgot your password? <Link href="/reset-password">Reset password</Link>
          </label>
        </div>

        {/* TODO: */}
        <div>
          <label>
            No account? <Link href="/signup">Create account</Link>
          </label>
        </div>

        <div className={positionButton}>
          <input className={submitButton} type="submit" value="Login" />
        </div>
      </form>

    </main>
  </Layout >)
}

// the login button that appears in the header of the website
export const LoginButton = () => {
  // get info on the current user via the context
  const context = useContext(UserContext);

  return (
    <>
      <div className={loginHeader}>
        {/* show a logout button if user is signed in, otherwise show login */}
        {context.user !== null ?
          <Link href=""
            onClick={(e) => {
              e.preventDefault();
              context.user?.signOut();
              context.setUser(null);
            }}>Logout</Link>
          : <Link href="/login">Login</Link>}
      </div>
    </>

  )
}

export default LoginPage


/* const SignIn = withAuthenticator(() => {
 *   const creds = useCredentials()
 *   if (creds) {
 *     // Redirect to profile page?
 *     return <p>Already signed in</p>
 *   } else {
 *     return <AmplifySignIn />
 *   }
 * }) */
