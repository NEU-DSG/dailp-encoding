import React, { useEffect } from "react"
import {
  unstable_Form as Form,
  unstable_FormSubmitButton as FormSubmitButton,
  unstable_FormStateReturn,
  unstable_useFormState as useFormState,
} from "reakit"
import { useCredentials, useUser } from "src/auth"
import { Button, Link } from "src/components"
import { centeredColumn } from "src/style/utils.css"
import { centeredForm, loginButton, positionButton } from "./login.css"
import { FormFields, LoginPageTemplate } from "./login.page"

const ResetPasswordPage = () => {
  const { user } = useUser()
  const { resetPassword, changePassword } = useUser().operations
  const token = useCredentials()

  const resetForm = useFormState({
    values: { email: "" },
    onValidate: (values) => {
      if (!values.email) {
        const errors = {
          email: "An email is required",
        }
        throw errors
      }
    },
    onSubmit: (values) => {
      resetPassword(values.email)
    },
  })

  const changeForm = useFormState({
    values: { verificationCode: "", newPassword: "", confirmPassword: "" },
    onValidate: (values) => {
      if (!values.verificationCode) {
        throw {
          username: "A verification code is required",
        }
      } else if (values.newPassword !== values.confirmPassword) {
        throw {
          confirmPassword: "Passwords must be the same",
        }
      }
    },
    onSubmit: (values) => {
      changePassword(values.verificationCode, values.newPassword)
    },
  })

  return (
    <>
      {/* if no user has been set to initialize the reset password flow */}
      {user === null ? (
        <ResetPassword {...resetForm} />
      ) : (
        <ChangePassword {...changeForm} />
      )}
    </>
  )
}

const ResetPassword = (form: unstable_FormStateReturn<{ email: string }>) => {
  return (
    <LoginPageTemplate
      header={
        <>
          <h1>Reset Password</h1>
          <h4>Enter the email associated with your account.</h4>
        </>
      }
    >
      <Form {...form} className={centeredForm}>
        <FormFields
          form={form}
          name="email"
          label="Email *"
          placeholder="mail@website.com"
        />

        <div className={positionButton}>
          <FormSubmitButton {...form} as={Button} className={loginButton}>
            Reset
          </FormSubmitButton>
        </div>
      </Form>
    </LoginPageTemplate>
  )
}

const ChangePassword = (
  form: unstable_FormStateReturn<{
    verificationCode: string
    newPassword: string
    confirmPassword: string
  }>
) => {
  const { setUser } = useUser()

  useEffect(() => {
    return () => {
      setUser(null) // prevents user state from being preserved between component refreshes, in case user does not complete change password flow
    }
  }, [])

  return (
    <LoginPageTemplate
      header={
        <>
          <h1 className={centeredColumn}>Change Password</h1>
          <h4>
            Enter the verification code sent to your email address and your new
            password.
          </h4>
        </>
      }
    >
      <Form {...form} className={centeredForm}>
        <FormFields
          form={form}
          name="verificationCode"
          label="Verification Code *"
          placeholder="enter code"
        />

        <FormFields
          form={form}
          name="newPassword"
          type="password"
          label="New Password *"
          placeholder="enter password"
        />

        <FormFields
          form={form}
          name="confirmPassword"
          type="password"
          label="Confirm Password *"
          placeholder="confirm password"
        />

        <div className={positionButton}>
          <FormSubmitButton {...form} as={Button} className={loginButton}>
            Confirm
          </FormSubmitButton>
        </div>
      </Form>
    </LoginPageTemplate>
  )
}

export const ResetLink = () => {
  const token = useCredentials()

  return (
    <>
      {!token && (
        <label>
          Forgot your password?{" "}
          <Link href="/reset-password">Reset password</Link>
        </label>
      )}
    </>
  )
}

export const Page = ResetPasswordPage
