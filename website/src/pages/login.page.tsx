import React, { ReactNode } from "react"
import {
  unstable_Form as Form,
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
  unstable_FormMessage as FormMessage,
  unstable_FormSubmitButton as FormSubmitButton,
  unstable_FormStateReturn,
  unstable_useFormState as useFormState,
} from "reakit/Form"
import { Popover, PopoverDisclosure, usePopoverState } from "reakit/Popover"
import { useCredentials, useUser } from "src/auth"
import { Button, Link } from "src/components"
import { cleanButton } from "src/components/button.css"
import Layout from "../layout"
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

export const LoginPageTemplate = (props: {
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

const LoginPage = () => {
  const { loginUser } = useUser().operations

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

  return (
    <LoginPageTemplate
      header={
        <>
          <h1>Log into your account</h1>
          <h4>
            Login to contribute to the archive by transcribing documents,
            recording pronunciations, providing cultural commentary, and more.
          </h4>
        </>
      }
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

        <div className={positionButton}>
          <FormSubmitButton {...loginForm} as={Button} className={loginButton}>
            Log in
          </FormSubmitButton>
        </div>
      </Form>
    </LoginPageTemplate>
  )
}

// the login button that appears in the header of the website
export const LoginHeaderButton = () => {
  // get the current user's auth token
  const token = useCredentials()

  return (
    <div className={loginHeader}>
      {/* if an auth token exists, that means a user is logged in */}
      {token ? <ConfirmLogout /> : <Link href="/login">Log in</Link>}
    </div>
  )
}

const ConfirmLogout = () => {
  const { user, setUser } = useUser()
  const popover = usePopoverState({ gutter: 2 })

  return (
    <>
      <PopoverDisclosure {...popover} className={cleanButton}>
        {popover.visible ? "Cancel" : "Log out"}
      </PopoverDisclosure>

      <Popover {...popover} tabIndex={0}>
        <Button
          className={popoverButton}
          onClick={() => {
            user?.signOut()
            setUser(null) // set current user to null because user has completed reset password flow and will need to relogin
          }}
        >
          Log out
        </Button>
      </Popover>
    </>
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

export default LoginPage
