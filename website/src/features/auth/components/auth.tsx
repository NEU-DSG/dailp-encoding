import {
  AuthenticationDetails,
  CognitoIdToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js"
import React, { createContext, useContext, useEffect, useState } from "react"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserGroup } from "../../../graphql/dailp"

type UserContextType = {
  user: CognitoUser | null
  isAuthLoading: boolean
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

const userPool = new CognitoUserPool({
  UserPoolId: process.env["DAILP_USER_POOL"] ?? "",
  ClientId: process.env["DAILP_USER_POOL_CLIENT"] ?? "",
})

/** Get the currently signed in user, if there is one. */
export function getCurrentUser(): CognitoUser | null {
  return userPool.getCurrentUser()
}

export const UserProvider = (props: { children: any }) => {
  const [user, setUser] = useState<CognitoUser | null>(
    // gets the last user that logged in via this user pool
    getCurrentUser()
  )
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  function refreshToken(): Promise<CognitoUserSession | null> {
    if (!user) return Promise.resolve(null)
    return new Promise((res, rej) => {
      // getSession() refreshes last authenticated user's tokens
      user.getSession(function (err: Error, result: CognitoUserSession | null) {
        if (err) rej(err)
        return res(result)
      })
    })
  }

  function resolveCognitoException(err: Error, userProvidedEmail?: string) {
    switch (err.name) {
      case CognitoErrorName.AliasExists:
        alert(
          `An account with the email ${userProvidedEmail} already exists. Please use a different email.`
        )
        break
      case CognitoErrorName.CodeDeliveryFailure:
        alert(`We could not send a confirmation code to ${
          user?.getUsername() || userProvidedEmail
        }. 
          Please make sure you have typed the correct email. 
          If this issue persists, wait and try again later.`)
        break
      case CognitoErrorName.CodeExpired:
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
      case CognitoErrorName.CodeMismatch:
        alert(
          `The code you entered does not match the code we sent you. Please double check your email or request a new code.`
        )
        console.log("confirmation failed")
        break
      case CognitoErrorName.InvalidPassword:
        alert(err.message || JSON.stringify(err))
        break
      case CognitoErrorName.NotAuthorized:
        alert(err.message || JSON.stringify(err))
        break
      case CognitoErrorName.PasswordResetRequired:
        if (
          confirm(
            `You must reset your password. Would you like to reset your password now?`
          )
        ) {
          navigate("/auth/reset-password")
        }
        break
      case CognitoErrorName.UserNotConfirmed:
        if (
          confirm(`Your account must be confirmed before you can log in.
          Would you like to confirm now?`)
        ) {
          navigate("/auth/confirmation")
        }
        break
      case CognitoErrorName.UsernameExists:
        alert(`An account with the email ${userProvidedEmail} already exists.
          Please sign up with a different email or try signing in with this email.`)
        break
      case CognitoErrorName.UserNotFound:
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

  // Allows persistence of the current user's session between browser refreshes.
  useEffect(() => {
    // if there is an authenticated user present
    if (user != null) {
      const promise = refreshToken().then((result) => {
        setIsAuthLoading(false)
        if (!result) return null
        const intervalLength =
          result.getAccessToken().getExpiration() * 1000 - Date.now()
        const handle = window.setInterval(() => refreshToken(), intervalLength)
        return handle
      })
      return () => {
        promise.then((handle) => {
          if (handle) {
            window.clearInterval(handle)
          }
        })
      }
    } else {
      // No user, auth loading is complete
      setIsAuthLoading(false)
    }

    return
  }, [user])

  function createUser(email: string, password: string) {
    let emailLowercase = email.toLowerCase()
    console.log(`requesting adding user ${emailLowercase} to Cognito User Pool`)
    let userAttributes = [{ Name: "email", Value: emailLowercase }].map(
      (attr) => {
        return new CognitoUserAttribute(attr)
      }
    )
    userPool.signUp(
      emailLowercase,
      password,
      userAttributes,
      [],
      async (err, result) => {
        if (err) {
          resolveCognitoException(err, emailLowercase)
        } else {
          await navigate("/auth/confirmation")
        }
      }
    )
  }

  function resetConfirmationCode(email: string) {
    let user = new CognitoUser({
      Username: email.toLowerCase(),
      Pool: userPool,
    })

    user.resendConfirmationCode((err, result) => {
      if (err) {
        resolveCognitoException(err, email)
      } else {
        console.log(result)
        alert(`A new confirmation code was sent to ${user.getUsername()}`)
      }
    })
  }

  function confirmUser(email: string, confirmationCode: string) {
    let user = new CognitoUser({
      Username: email.toLowerCase(),
      Pool: userPool,
    })

    user.confirmRegistration(confirmationCode, false, (err, result) => {
      if (err) {
        console.log("confirmation failed. determining error")
        resolveCognitoException(err, user.getUsername())
      }
      console.log("confirmation details: ", result)
      navigate("/auth/login")
    })
  }

  function loginUser(username: string, password: string) {
    const user = new CognitoUser({
      Username: username.toLowerCase(),
      Pool: userPool,
    })

    const authDetails = new AuthenticationDetails({
      Username: username.toLowerCase(),
      Password: password,
    })

    // logs in the user with the authentication details
    user.authenticateUser(authDetails, {
      onSuccess: (data: CognitoUserSession) => {
        setUser(user)
        navigate("/dashboard")
      },
      onFailure: (err: Error) => {
        console.log("Login failed. Result: ", err)
        resolveCognitoException(err, user.getUsername())
      },
      newPasswordRequired: (data: CognitoUserSession) => {
        console.log("New password required. Result: ", data)
        alert("New password is required")
        navigate("auth/reset-password")
      },
    })
  }

  function resetPassword(username: string) {
    // instantiate a new user with the given credentials to access Cognito API methods
    const user = new CognitoUser({
      Username: username.toLowerCase(),
      Pool: userPool,
    })

    user.forgotPassword({
      onSuccess: (data: CognitoUserSession) => {
        setUser(user) // set current user, since a reset password flow was initialized
        console.log("Reset password successful. Result: ", data)
        alert("Reset email successfully sent")
      },
      onFailure: (err: Error) => {
        console.log("Reset password unsuccessful. Result: ", err)
        resolveCognitoException(err, user.getUsername())
      },
    })
  }

  function changePassword(verificationCode: string, newPassword: string) {
    user?.confirmPassword(verificationCode, newPassword, {
      async onSuccess(data: string) {
        setUser(null) // since user successfully changed password, reset current user's state
        await navigate("/auth/login")

        console.log("Change password successful. Result: ", data)
        alert("Password successfully changed")
      },
      onFailure(err: Error) {
        console.log("Change password unsuccessful. Result: ", err)
        alert(err.message)
      },
    })
  }

  function signOutUser() {
    user?.signOut(() => {
      setUser(null)
    })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthLoading,
        operations: {
          createUser,
          resetConfirmationCode: resetConfirmationCode,
          confirmUser: confirmUser,
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

export const useAuthLoading = () => {
  const context = useContext(UserContext)
  return context.isAuthLoading
}

// returns a jwt token
export const useCredentials = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error("`useUser` must be within a `UserProvider`")
  }

  // gets the jwt token of the currently signed in user
  const creds = context.user?.getSignInUserSession()?.getIdToken().getJwtToken()

  return creds ?? null
}

export const useCognitoUserGroups = (): UserGroup[] => {
  const { user } = useContext(UserContext)
  const groups: string[] =
    user?.getSignInUserSession()?.getIdToken().payload["cognito:groups"] ?? []
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
  const sub: string | null =
    user?.getSignInUserSession()?.getIdToken().payload["sub"] ?? null
  return sub
}

function getUserSessionAsync(
  user: CognitoUser
): Promise<CognitoUserSession | null> {
  return new Promise((res, _rej) => {
    user.getSession(function (_err: Error, result: CognitoUserSession | null) {
      res(result)
    })
  })
}

/**
 * Get the user's id token, if they are signed in.
 *
 * Note: You should use the `useCredentials` hook if you are writing a component.
 */
export async function getIdToken(): Promise<CognitoIdToken | null> {
  const user = getCurrentUser()
  if (!user) return null

  const sess = await getUserSessionAsync(user)
  return sess?.getIdToken() ?? null
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
