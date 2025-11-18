import React, { useEffect } from "react"
import {
  Button,
  unstable_Form as Form,
  unstable_FormStateReturn,
  unstable_useFormState as useFormState,
} from "reakit"
import { useUser } from "src/auth"
import { fonts } from "src/style/theme-contract.css"
import {
  FormFields,
  FormSubmitButton,
  UserAuthPageTemplate,
} from "./user-auth-layout"
import { centeredForm, secondaryButton } from "./user-auth.css"

const ResetPasswordPage = () => {
  const { user } = useUser()
  const { resetPassword, changePassword } = useUser().operations

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
    <UserAuthPageTemplate
      header={{
        prompt: "Reset Password",
        description: `Enter the email associated with your account.`,
      }}
    >
      <Form {...form} className={centeredForm}>
        <FormFields
          form={form}
          name="email"
          label="Email *"
          placeholder="mail@website.com"
        />

        <FormSubmitButton form={form} label="Reset" />
      </Form>
    </UserAuthPageTemplate>
  )
}

const ChangePassword = (
  form: unstable_FormStateReturn<{
    verificationCode: string
    newPassword: string
    confirmPassword: string
  }>
) => {
  const { user } = useUser()
  const { resendPasswordResetCode } = useUser().operations

  const startCodeResend = () => {
    if (user?.type === "dailp") {
      resendPasswordResetCode(user.email)
    } else if (user?.type === "cognito") {
      const email = user.user.getUsername()
      resendPasswordResetCode(email)
    } else {
      alert("Please go back and re-enter your email.")
    }
  }

  return (
    <UserAuthPageTemplate
      header={{
        prompt: "Change Password",
        description: `Enter the verification code sent to your email address and your new
        password.`,
      }}
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

        <span className={fonts.body}>
          Didn't receive your code?
          <Button onClick={startCodeResend} className={secondaryButton}>
            Resend Code
          </Button>
        </span>

        <FormSubmitButton form={form} label="Confirm" />
      </Form>
    </UserAuthPageTemplate>
  )
}

export const Page = ResetPasswordPage
