import { TurnstileInstance, TurnstileProps } from "@marsidev/react-turnstile"
import React, { ForwardRefExoticComponent, useEffect, useState } from "react"
import {
  unstable_Form as Form,
  unstable_useFormState as useFormState,
} from "reakit"
import { useUser } from "src/auth"
import {
  FormFields,
  FormSubmitButton,
  LoginLink,
  UserAuthPageTemplate,
} from "./user-auth-layout"
import { centeredForm } from "./user-auth.css"
import * as Dailp from "src/graphql/dailp"

const SignupPage = () => {
  const { createUser } = useUser().operations
  const [,validateTurnstileToken] = Dailp.useValidateTurnstileTokenMutation()
  const [turnstileToken, setTurnstileToken] = useState("")

  const signupForm = useFormState({
    values: { email: "", password: "" },
    onValidate: (values) => {
      if (!values.email) {
        throw { email: "An email is required" }
      } else if (!values.password) {
        throw { password: "A password is required" }
      }
    },
    onSubmit: (values) => {
      console.log(`Submitted! email is ${values.email}`)

      if (!turnstileToken) {
        throw { turnstileToken: "A turnstile token is required" }
      }

      validateTurnstileToken({
        token: turnstileToken,
      })
      .then((result) => {
        if (result.data?.validateTurnstileToken) {
          createUser(values.email, values.password)
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
    <UserAuthPageTemplate
      header={{
        prompt: "Create your account.",
        description: `Create an account to contribute to the archive by transcribing
        documents, recording pronunciations, providing cultural commentary,
        and more.`,
      }}
    >
      <Form {...signupForm} className={centeredForm}>
        <FormFields
          form={signupForm}
          name="email"
          label="Email *"
          placeholder="mail@website.com"
        />

        <FormFields
          form={signupForm}
          name="password"
          label="Password *"
          type="password"
          placeholder="enter password"
        />

        <LoginLink />

        <FormSubmitButton form={signupForm} label="Sign Up" />
        {TurnstileClient && siteKey && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <TurnstileClient siteKey={siteKey} onSuccess={(token) => setTurnstileToken(token)} />
          </div>
        )}
      </Form>
    </UserAuthPageTemplate>
  )
}

export const Page = SignupPage
