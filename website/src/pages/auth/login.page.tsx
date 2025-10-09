import React, { useEffect } from "react"
import {
  unstable_Form as Form,
  unstable_useFormState as useFormState,
} from "reakit"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserRole, useUser, useUserRole } from "src/components/auth"
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
      loginUser(values.email, values.password)
    },
  })
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
        <FormSubmitButton form={loginForm} label="Log In" />
      </Form>
    </UserAuthPageTemplate>
  )
}

export const Page = LoginPage
