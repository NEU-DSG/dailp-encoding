import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js"
import { navigate } from "vite-plugin-ssr/client/router"
import { AuthUser } from "./auth"

export function useCognitoAuthOperations(
  userPool: CognitoUserPool,
  setUser: (user: AuthUser | null) => void
) {
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
        setUser({ type: "cognito", user })
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
        setUser({ type: "cognito", user }) // set current user, since a reset password flow was initialized
        console.log("Reset password successful. Result: ", data)
        alert("Reset email successfully sent")
      },
      onFailure: (err: Error) => {
        console.log("Reset password unsuccessful. Result: ", err)
        resolveCognitoException(err, user.getUsername())
      },
    })
  }

  function changePassword(
    user: CognitoUser,
    verificationCode: string,
    newPassword: string
  ) {
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

  function signOutUser(user: CognitoUser) {
    user.signOut(() => {
      setUser(null)
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

  function resendPasswordResetCode(email: string) {
    // For Cognito, resending password reset is the same as initiating it
    // Just calling forgotPassword again will send a new code
    resetPassword(email)
  }

  async function setupTokenRefresh(user: CognitoUser): Promise<number | null> {
    return new Promise((res, rej) => {
      user.getSession(function (err: Error, result: CognitoUserSession | null) {
        if (err) {
          rej(err)
          return
        }
        if (!result) {
          res(null)
          return
        }
        const intervalLength =
          result.getAccessToken().getExpiration() * 1000 - Date.now()
        const handle = window.setInterval(() => {
          // Refresh token
          user.getSession(() => {})
        }, intervalLength)
        res(handle)
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
        alert(`We could not send a confirmation code to ${userProvidedEmail}. 
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
  return {
    createUser,
    loginUser,
    resetConfirmationCode,
    resendPasswordResetCode,
    resetPassword,
    changePassword,
    signOutUser,
    confirmUser,
    setupTokenRefresh,
  }
}

export function getUserSessionAsync(
  user: CognitoUser
): Promise<CognitoUserSession | null> {
  return new Promise((res, rej) => {
    user.getSession(function (err: Error, result: CognitoUserSession | null) {
      if (err) rej(err)
      else res(result)
    })
  })
}

/**
 * Errors that can be returned by the Cognito API
 */
export enum CognitoErrorName {
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
