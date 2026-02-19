import { TurnstileInstance } from "@marsidev/react-turnstile"
import { TurnstileProps } from "@marsidev/react-turnstile"
import React, { ForwardRefExoticComponent, useEffect, useState } from "react"
import {
  unstable_Form as Form,
  unstable_useFormState as useFormState,
} from "reakit"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserRole, useUser, useUserRole } from "src/auth"
import * as Dailp from "src/graphql/dailp"
import {
  FormFields,
  FormSubmitButton,
  ResetLink,
  SignupLink,
  UserAuthPageTemplate,
} from "./user-auth-layout"
import { centeredForm } from "./user-auth.css"

const LoginPage = () => {
  const {
    user,
    operations: { loginUser },
  } = useUser()
  // const [, validateTurnstileToken] = Dailp.useValidateTurnstileTokenMutation()
  // const [turnstileToken, setTurnstileToken] = useState("")

  // If already authenticated, redirect away from the login page
  useEffect(() => {
    if (user) {
      navigate("/dashboard")
    }
  }, [user])

  const loginForm = useFormState({
    values: { email: "", password: "" },
    onValidate: (values) => {
      if (!values.email) {
        throw { email: "An email is required" }
      } else if (!values.password) {
        throw { password: "A password is required" }
      }
    },
    onSubmit: (values) => {
      // if (!turnstileToken) {
      //   throw { turnstileToken: "A turnstile token is required" }
      // }
      loginUser(values.email, values.password)

      // validateTurnstileToken({
      //   token: turnstileToken,
      // }).then((result) => {
      //   if (result.data?.validateTurnstileToken) {
      //     loginUser(values.email, values.password)
      //   } else {
      //     throw { turnstileToken: "Invalid turnstile token" }
      //   }
      // })
    },
  })

  // const [TurnstileClient, setTurnstileClient] =
  //   useState<ForwardRefExoticComponent<
  //     TurnstileProps & React.RefAttributes<TurnstileInstance | undefined>
  //   > | null>(null)
  // const [siteKey, setSiteKey] = useState<string | null>(null)

  // useEffect(() => {
  //   import("@marsidev/react-turnstile").then((m) => {
  //     setTurnstileClient(m.Turnstile)
  //     setSiteKey(process.env["TURNSTILE_SITE_KEY"] ?? null)
  //   })
  // }, [])

  // Avoid flashing the login form if we're redirecting
  if (user) return null

  return (
    <UserAuthPageTemplate
      header={{
        prompt: "Log into your account",
        description: `Login to contribute to the archive by transcribing documents,
        recording pronunciations, providing cultural commentary, and more.`,
      }}
    >
      <Form {...loginForm} className={centeredForm}>
        <FormFields
          form={loginForm}
          name="email"
          label="Email *"
          placeholder="mail@website.com"
        />

        <FormFields
          form={loginForm}
          name="password"
          label="Password *"
          type="password"
          placeholder="enter password"
        />
        <ResetLink />
        <SignupLink />
        {
          /// NOTE: We use TurnstileClient over Turnstile component to avoid acant find jsx error
          /// Reference: https://github.com/marsidev/react-turnstile/issues/96
          // TurnstileClient && siteKey && (
          //   <div style={{ display: "flex", justifyContent: "center" }}>
          //     <TurnstileClient
          //       siteKey={siteKey}
          //       onSuccess={(token) => setTurnstileToken(token)}
          //     />
          //   </div>
          // )
        }
        <FormSubmitButton form={loginForm} label="Log In" />
      </Form>
    </UserAuthPageTemplate>
  )
}

export const Page = LoginPage
