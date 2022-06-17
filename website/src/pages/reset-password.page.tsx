import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js"
import React, { useState } from "react"
import {
  unstable_Form as Form,
  unstable_FormMessage as FormMessage,
  unstable_FormSubmitButton as FormSubmitButton,
  unstable_FormStateReturn,
  unstable_useFormState as useFormState,
} from "reakit/Form"
import { userPool } from "src/auth"
import Link from "src/components/link"
import Layout from "src/layout"
import { centeredColumn } from "src/sprinkles.css"
import {
  centeredForm,
  positionButton,
  skinnyWidth,
  submitButton,
} from "./login.css"
import { FormFields } from "./login.page"

const ResetPasswordPage = () => {
  const [username, setUsername] = useState("")

  const resetForm = useFormState({
    values: { username: "" },
    onValidate: (values) => {
      if (!values.username) {
        const errors = {
          username: "A username is required",
        }
        throw errors
      }
    },
    onSubmit: (values) => {
      const user = new CognitoUser({
        Username: values.username,
        Pool: userPool,
      })

      user.forgotPassword({
        onSuccess: (data: CognitoUserSession) => {
          console.log("Password reset successful. Result: ", data)
          setUsername(values.username)
        },
        onFailure: (err: Error) => {
          alert("Email address does not exist")
        },
      })
    },
  })

  const changeForm = useFormState({
    values: { verificationCode: "", newPassword: "" },
    onValidate: (values) => {
      if (!values.verificationCode || !values.newPassword) {
        const errors = {
          username: "A verification code and new password is required",
        }
        throw errors
      }
    },
    onSubmit: (values) => {
      const user = new CognitoUser({
        Username: username,
        Pool: userPool,
      })

      user.confirmPassword(values.verificationCode, values.newPassword, {
        onSuccess(data: string) {
          console.log(data)
        },
        onFailure(err: Error) {
          console.log(err)
        },
      })
    },
  })

  return (
    <Layout>
      <main className={skinnyWidth}>
        {username === "" ? (
          <ResetPassword {...resetForm} />
        ) : (
          <ChangePassword {...changeForm} />
        )}
      </main>
    </Layout>
  )
}

const ResetPassword = (
  form: unstable_FormStateReturn<{ username: string }>
) => {
  return (
    <>
      <header>
        <h1 className={centeredColumn}>Reset Password</h1>
        <h4>Enter the email associated with your account.</h4>
      </header>

      <Form {...form} className={centeredForm}>
        <FormFields
          form={form}
          name="username"
          label="Email *"
          placeholder="mail@website.com"
        />

        <div className={positionButton}>
          <FormSubmitButton {...form} className={submitButton}>
            Reset
          </FormSubmitButton>
        </div>
      </Form>
    </>
  )
}

const ChangePassword = (
  form: unstable_FormStateReturn<{
    verificationCode: string
    newPassword: string
  }>
) => {
  return (
    <>
      <header>
        <h1 className={centeredColumn}>Change Password</h1>
        <h4>
          Enter the verification code sent to your email address and your new
          password.
        </h4>
      </header>

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
          label="New Password *"
          placeholder="enter password"
        />

        <FormMessage {...form} name="verificationCode" />
        <FormMessage {...form} name="newPassword" />

        <div className={positionButton}>
          <FormSubmitButton {...form} className={submitButton}>
            Confirm
          </FormSubmitButton>
        </div>
      </Form>
    </>
  )
}

export const ResetLink = () => {
  return (
    <div>
      <label>
        Forgot your password? <Link href="/reset-password">Reset password</Link>
      </label>
    </div>
  )
}

export default ResetPasswordPage
