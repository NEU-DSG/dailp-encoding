import React, { ReactNode } from "react"
import {
  unstable_Form as Form,
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
  unstable_FormMessage as FormMessage,
  unstable_FormSubmitButton as FormSubmitButton,
  unstable_FormStateReturn,
  unstable_useFormState as useFormState,
} from "reakit"
import { Popover, PopoverDisclosure, usePopoverState } from "reakit"
import { useCredentials, useUser } from "src/auth"
import { Button, Link } from "src/components"
import { cleanButton } from "src/components/button.css"
import Layout from "../../layout"
import {
  centeredForm,
  centeredHeader,
  loginButton,
  loginFormBox,
  loginHeader,
  popoverButton,
  positionButton,
  skinnyWidth,
} from "./login.css"
import { ResetLink } from "./reset-password.page"

export const SignupPageTemplate = (props: {
  header: ReactNode
  children: ReactNode
}) => {
  return (
    <Layout>
      <main className={skinnyWidth}>
        <header className={centeredHeader}>{props.header}</header>
        {props.children}
      </main>
    </Layout>
  )
}

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
    <SignupPageTemplate
      header={
        <>
          <h1>Create your account</h1>
          <h4>
            Create an account to contribute to the archive by transcribing
            documents, recording pronunciations, providing cultural commentary,
            and more.
          </h4>
        </>
      }
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
        <ResetLink />

        <div className={positionButton}>
          <FormSubmitButton {...signupForm} as={Button} className={loginButton}>
            Sign Up
          </FormSubmitButton>
        </div>
      </Form>
    </SignupPageTemplate>
  )
}

interface FormFieldsType {
  form: unstable_FormStateReturn<any | undefined>
  name: any
  label: string
  type?: string | undefined
  placeholder: string
}

export const FormFields = ({
  form,
  name,
  label,
  type,
  placeholder,
}: FormFieldsType) => {
  return (
    <>
      <FormLabel {...form} name={name} label={label} />

      <FormInput
        {...form}
        name={name}
        className={loginFormBox}
        type={type}
        placeholder={placeholder}
      />

      <FormMessage {...form} name={name} />
    </>
  )
}

export const SignupLink = () => {
  // const token = useCredentials()
  return (
    <>
      <label>
        Dont have an account? <Link href="/signup">Sign Up</Link>
      </label>
    </>
  )
}

export const Page = SignupPage
