import { TurnstileInstance } from "@marsidev/react-turnstile"
import { TurnstileProps } from "@marsidev/react-turnstile"
import React, { ForwardRefExoticComponent, useEffect, useState } from "react"
import {
  unstable_Form as Form,
  unstable_FormStateReturn,
  unstable_useFormState as useFormState,
} from "reakit"
import { useUser } from "src/auth"
import * as Dailp from "src/graphql/dailp"
import {
  FormFields,
  FormSubmitButton,
  UserAuthPageTemplate,
} from "./user-auth-layout"
import { centeredForm } from "./user-auth.css"

const ResetPasswordPage = () => {
  const { user } = useUser()
  const { resetPassword, changePassword } = useUser().operations
  const [, validateTurnstileToken] = Dailp.useValidateTurnstileTokenMutation()
  const [turnstileToken, setTurnstileToken] = useState("")

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
      if (!turnstileToken) {
        throw { turnstileToken: "A turnstile token is required" }
      }

      validateTurnstileToken({
        token: turnstileToken,
      }).then((result) => {
        if (result.data?.validateTurnstileToken) {
          resetPassword(values.email)
        } else {
          throw { turnstileToken: "Invalid turnstile token" }
        }
      })
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
      if (!turnstileToken) {
        throw { turnstileToken: "A turnstile token is required" }
      }

      validateTurnstileToken({
        token: turnstileToken,
      }).then((result) => {
        if (result.data?.validateTurnstileToken) {
          changePassword(values.verificationCode, values.newPassword)
        } else {
          throw { turnstileToken: "Invalid turnstile token" }
        }
      })
    },
  })

  const [TurnstileClient, setTurnstileClient] =
    useState<ForwardRefExoticComponent<
      TurnstileProps & React.RefAttributes<TurnstileInstance | undefined>
    > | null>(null)
  const [siteKey, setSiteKey] = useState<string | null>(null)

  useEffect(() => {
    import("@marsidev/react-turnstile").then((m) => {
      setTurnstileClient(m.Turnstile)
      setSiteKey(process.env["TURNSTILE_SITE_KEY"] ?? null)
    })
  }, [])

  return (
    <>
      {/* if no user has been set to initialize the reset password flow */}
      {user === null ? (
        <ResetPassword {...resetForm} />
      ) : (
        <ChangePassword {...changeForm} />
      )}
      {TurnstileClient && siteKey && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TurnstileClient
            siteKey={siteKey}
            onSuccess={(token) => setTurnstileToken(token)}
          />
        </div>
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

        <FormSubmitButton form={form} label="Confirm" />
      </Form>
    </UserAuthPageTemplate>
  )
}

export const Page = ResetPasswordPage
