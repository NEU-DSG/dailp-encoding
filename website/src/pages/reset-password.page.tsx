import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js"
import React, { useState } from "react"
import {
  unstable_Form as Form,
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
  loginButton,
  positionButton,
  skinnyWidth,
} from "./login.css"
import { FormFields } from "./login.page"

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("")

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
      const user = new CognitoUser({
        Username: values.email,
        Pool: userPool,
      })

      user.forgotPassword({
        onSuccess: (data: CognitoUserSession) => {
          console.log("Password reset successful. Result: ", data)
          setEmail(values.email)
        },
        onFailure: (err: Error) => {
          console.log("Password reset unsuccessful. Error: ", err)
          alert("Email address does not exist")
        },
      })
    },
  })

  const changeForm = useFormState({
    values: { verificationCode: "", newPassword: "" },
    onValidate: (values) => {
      if (!values.verificationCode) {
        throw {
          username: "A verification code is required",
        }
      } else if (!values.newPassword) {
        throw {
          newPassword: "A new password is required",
        }
      }
    },
    onSubmit: (values) => {
      const user = new CognitoUser({
        Username: email,
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
        {email === "" ? (
          <ResetPassword {...resetForm} />
        ) : (
          <ChangePassword {...changeForm} />
        )}
      </main>
    </Layout>
  )
}

const ResetPassword = (form: unstable_FormStateReturn<{ email: string }>) => {
  return (
    <>
      <header>
        <h1 className={centeredColumn}>Reset Password</h1>
        <h4>Enter the email associated with your account.</h4>
      </header>

      <Form {...form} className={centeredForm}>
        <FormFields
          form={form}
          name="email"
          label="Email *"
          placeholder="mail@website.com"
        />

        <div className={positionButton}>
          <FormSubmitButton {...form} className={loginButton}>
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

        <div className={positionButton}>
          <FormSubmitButton {...form} className={loginButton}>
            Confirm
          </FormSubmitButton>
        </div>
      </Form>
    </>
  )
}

export const ResetLink = () => {
  return (
    <label>
      Forgot your password? <Link href="/reset-password">Reset password</Link>
    </label>
  )
}

export default ResetPasswordPage
