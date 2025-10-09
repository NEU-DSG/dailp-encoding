import React from "react"
import {
  unstable_Form as Form,
  unstable_useFormState as useFormState,
} from "reakit"
import { useUser } from "src/components/auth"
import {
  FormFields,
  FormSubmitButton,
  LoginLink,
  UserAuthPageTemplate,
} from "./user-auth-layout"
import { centeredForm } from "./user-auth.css"

const SignupPage = () => {
  const { createUser } = useUser().operations

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
      createUser(values.email, values.password)
    },
  })

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
      </Form>
    </UserAuthPageTemplate>
  )
}

export const Page = SignupPage
