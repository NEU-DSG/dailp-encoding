import {
  Amplify,
  Auth,
} from "aws-amplify"
import React, { createContext, useContext, useEffect, useState } from "react"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserGroup } from "./graphql/dailp"

type UserContextType = {
  // a little dissapointed aws amplify doesnt have a type for this :(  
  user: any
  operations: {
    createUser: (username: string, password: string) => void
    resetConfirmationCode: (email: string) => void
    confirmUser: (email: string, confirmationCode: string) => void
    loginUser: (username: string, password: string) => void
    resetPassword: (username: string) => void
    changePassword: (verificationCode: string, newPassword: string) => void
    signOutUser: () => void
  }
}

const UserContext = createContext<UserContextType>({} as UserContextType)

//setting up amplify auth with env variables
Amplify.configure({
  Auth: {
    region: process.env["DAILP_AWS_REGION"] ?? "",
    userPoolId: process.env["DAILP_USER_POOL"] ?? "",
    userPoolWebClientId: process.env["DAILP_USER_POOL_CLIENT"] ?? "",
    identityPoolId: process.env["DAILP_IDENTITY_POOL"] ?? "",
  }
})

//get currently signed in user
export async function getCurrentUser() {
  try {
    return await Auth.currentAuthenticatedUser()
  } catch {
    return null
  }
}

//user functions 
export const UserProvider = (props: { children: any }) => {
  const [user, setUser] = useState<any>(null)

  // Initialize user state from any existing session
  useEffect(() => {
    const initUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser()
        setUser(currentUser)
      } catch (err) {
        setUser(null)
      }
    }
    initUser()
  }, [])

  //cases for cognito exceptions
  function resolveCognitoException(err: Error, userProvidedEmail?: string) {
    const errorName = err.name
    switch (errorName) {
      case "AliasExistsException":
        alert(
          `An account with the email ${userProvidedEmail} already exists. Please use a different email.`
        )
        break
      case "CodeDeliveryFailureException":
        alert(`We could not send a confirmation code to ${user?.getUsername() || userProvidedEmail
          }. 
          Please make sure you have typed the correct email. 
          If this issue persists, wait and try again later.`)
        break
      case "CodeExpiredException":
        let userResponse = confirm(
          `This confirmation code has expired. Request a new code?`
        )
        let messageEmail =
          userProvidedEmail ||
          prompt("Please enter the email associated with your account.")
        if (userResponse && messageEmail) {
          resetConfirmationCode(messageEmail)
        } else if (userResponse) {
          alert("Please try again and enter your email.")
        }
        break
      case "CodeMismatchException":
        alert(
          `The code you entered does not match the code we sent you. Please double check your email or request a new code.`
        )
        console.log("confirmation failed")
        break
      case "InvalidPasswordException":
        alert(err.message || JSON.stringify(err))
        break
      case "NotAuthorizedException":
        alert(err.message || JSON.stringify(err))
        break
      case "PasswordResetRequiredException":
        if (
          confirm(
            `You must reset your password. Would you like to reset your password now?`
          )
        ) {
          navigate("/auth/reset-password")
        }
        break
      case "UserNotConfirmedException":
        if (
          confirm(`Your account must be confirmed before you can log in.
          Would you like to confirm now?`)
        ) {
          navigate("/auth/confirmation")
        }
        break
      case "UsernameExistsException":
        alert(`An account with the email ${userProvidedEmail} already exists.
          Please sign up with a different email or try signing in with this email.`)
        break
      case "UserNotFoundException":
        if (
          confirm(
            `Account with email ${userProvidedEmail} not found. Would you like to create an account now?`
          )
        ) {
          navigate("/auth/signup")
        }
        break // TODO We should tell a user how to create a new account later
      default:
        console.log(err)
        alert(
          `An unexpected error occured. Please try again or contact a site administrator.
          Error details: ${err.name}
          ${err.message}
          `
        )
        break
    }
  }

  // Refresh token if user exists
  useEffect(() => {
    if (user) {
      const checkSession = async () => {
        try {
          await Auth.currentSession()
        } catch (err) {
          console.error("Error refreshing session:", err)
        }
      }

      // Check session immediately
      checkSession()

      // Set up periodic refresh
      const REFRESH_INTERVAL = 15 * 60 * 1000 // 15 minutes
      const intervalId = setInterval(checkSession, REFRESH_INTERVAL)

      return () => clearInterval(intervalId)
    } else {
      console.log("no user")
    }
  }, [user])

  //function to create user
  async function createUser(email: string, password: string) {
    let emailLowercase = email.toLowerCase()
    console.log(`requesting adding user ${emailLowercase} to Cognito User Pool`)

    try {
      const result = await Auth.signUp({
        username: emailLowercase,
        password,
        attributes: {
          email: emailLowercase,
        },
      })

      console.log("Sign up success, result:", result)
      await navigate("/auth/confirmation")
    } catch (err: any) {
      resolveCognitoException(err, emailLowercase)
    }
  }

  //function to reset confirmation code
  async function resetConfirmationCode(email: string) {
    try {
      const result = await Auth.resendSignUp(email.toLowerCase())
      console.log(result)
      alert(`A new confirmation code was sent to ${email.toLowerCase()}`)
    } catch (err: any) {
      resolveCognitoException(err, email)
    }
  }

  //function to confirm user with confirmation code
  async function confirmUser(email: string, confirmationCode: string) {
    try {
      const result = await Auth.confirmSignUp(email.toLowerCase(), confirmationCode)
      console.log("confirmation details: ", result)
      navigate("/auth/login")
    } catch (err: any) {
      console.log("confirmation failed. determining error")
      resolveCognitoException(err, email.toLowerCase())
    }
  }

  //login function
  async function loginUser(username: string, password: string) {
    try {
      const user = await Auth.signIn(username.toLowerCase(), password)
      console.log("DENNIS LOGGED IN YAY   ", user)
      setUser(user)
      navigate("/dashboard")
    } catch (err: any) {
      console.log("Login failed. Result: ", err)
      resolveCognitoException(err, username.toLowerCase())
    }
  }

  //reset password function 
  async function resetPassword(username: string) {
    try {
      const result = await Auth.forgotPassword(username.toLowerCase())
      setUser(await getCurrentUser()) // set current user, since a reset password flow was initialized
      console.log("Reset password successful. Result: ", result)
      alert("Reset email successfully sent")
    } catch (err: any) {
      console.log("Reset password unsuccessful. Result: ", err)
      resolveCognitoException(err, username.toLowerCase())
    }
  }

  //function to change password
  async function changePassword(verificationCode: string, newPassword: string) {
    if (!user) {
      console.error("No user is currently signed in")
      return
    }

    try {
      await Auth.forgotPasswordSubmit(
        user.username || user.getUsername(),
        verificationCode,
        newPassword
      )

      setUser(null) // since user successfully changed password, reset current user's state
      await navigate("/auth/login")

      console.log("Change password successful.")
      alert("Password successfully changed")
    } catch (err: any) {
      console.log("Change password unsuccessful. Result: ", err)
      alert(err.message)
    }
  }

  //sign out
  async function signOutUser() {
    try {
      await Auth.signOut()
      setUser(null)
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        operations: {
          createUser,
          resetConfirmationCode,
          confirmUser,
          loginUser,
          resetPassword,
          changePassword,
          signOutUser,
        },
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  return context
}

// returns a jwt token
export const useCredentials = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error("`useUser` must be within a `UserProvider`")
  }

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      if (context.user) {
        try {
          //sing out
          const session = await Auth.currentSession()
          setToken(session.getIdToken().getJwtToken())
        } catch (err) {
          console.error("Error getting token:", err)
          setToken(null)
        }
      } else {
        setToken(null)
      }
    }

    getToken()
  }, [context.user])

  return token
}

export const useCognitoUserGroups = (): UserGroup[] => {
  const { user } = useContext(UserContext)
  const [groups, setGroups] = useState<string[]>([])

  useEffect(() => {
    const getGroups = async () => {
      if (user) {
        try {
          const session = await Auth.currentSession()
          const cognitoGroups = session.getIdToken().payload["cognito:groups"] || []
          setGroups(cognitoGroups)
        } catch (err) {
          console.error("Error getting user groups:", err)
          setGroups([])
        }
      } else {
        setGroups([])
      }
    }

    getGroups()
  }, [user])

  return groups
    .map((g) => g.toUpperCase())
    .filter((g): g is UserGroup =>
      Object.values(UserGroup).includes(g as UserGroup)
    )
}

/**
 * A user has one and only one `role`. A role is typically a users most
 * permissive `group`, or `READER` if they have no `groups`.
 */
export enum UserRole {
  Reader = "READER",
  Contributor = "CONTRIBUTOR",
  Editor = "EDITOR",
  Admin = "ADMIN",
}

export function useUserRole(): UserRole {
  const groups = useCognitoUserGroups()
  if (groups.includes(UserGroup.Editors)) return UserRole.Editor
  else if (groups.includes(UserGroup.Contributors)) return UserRole.Contributor
  else return UserRole.Reader
}

export const useUserId = () => {
  const { user } = useContext(UserContext)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const getUserId = async () => {
      if (user) {
        try {
          const session = await Auth.currentSession()
          setUserId(session.getIdToken().payload["sub"] || null)
        } catch (err) {
          console.error("Error getting user ID:", err)
          setUserId(null)
        }
      } else {
        setUserId(null)
      }
    }

    getUserId()
  }, [user])

  return userId
}

/**
 * Get the user's id token, if they are signed in.
 *
 * Note: You should use the `useCredentials` hook if you are writing a component.
 */
export async function getIdToken() {
  try {
    const session = await Auth.currentSession()
    return session.getIdToken()
  } catch (err) {
    console.error("Error getting ID token:", err)
    return null
  }
}

/**
 * Errors that can be returned by the Cognito API
 */
enum CognitoErrorName {
  /** User tries to log in but hasnt confirmed */
  UserNotConfirmed = "UserNotConfirmedException",
  /** User has requested password reset but not completed */
  PasswordResetRequired = "PasswordResetRequiredException",
  /** User isnt authorized */
  NotAuthorized = "NotAuthorizedException",
  /** User does not exist */
  UserNotFound = "UserNotFoundException",
  /** Code sent but has since expired */
  CodeExpired = "ExpiredCodeException",
  /** Code failed to send */
  CodeDeliveryFailure = "CodeDeliveryFailureException",
  /** Input code does not match sent code */
  CodeMismatch = "CodeMismatchException",
  /** Email is in use by another account in this pool */
  AliasExists = "AliasExistsException",
  /** Like `AliasExists` but specifically used for AWS Cognito `SignUp` action */
  UsernameExists = "UsernameExistsException",
  /** Password does not meet requirements for this user pool */
  InvalidPassword = "InvalidPasswordException",
}
