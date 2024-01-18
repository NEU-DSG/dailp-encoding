import React, { ReactNode } from "react"
import {
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
  unstable_FormMessage as FormMessage,
  unstable_FormSubmitButton as FormSubmit,
  unstable_FormStateReturn,
} from "reakit"
import { useCredentials, useUser } from "src/auth"
import { Button, CleanButton, Link } from "src/components"
import { AccountMenu } from "src/components/authenticated-users/account-menu"
import { centeredColumn } from "src/style/utils.css"
import Layout from "../../layout"
import {
  centeredHeader,
  loginButton,
  loginFormBox,
  loginHeader,
  positionButton,
  skinnyWidth,
} from "./user-auth.css"

export const UserAuthPageTemplate = (props: {
  header: { prompt: string; description: string }
  children: ReactNode
}) => {
  return (
    <Layout>
      <main className={skinnyWidth}>
        <header className={centeredHeader}>
          <h1 className={centeredColumn}>{props.header.prompt}</h1>
          <p>{props.header.description}</p>
        </header>
        {props.children}
      </main>
    </Layout>
  )
}

// the login button that appears in the header of the website
export const LoginHeaderButton = (props?: { className?: string }) => {
  // get the current user's auth token
  const token = useCredentials()

  return (
    <div className={loginHeader}>
      {/* if an auth token exists, that means a user is logged in */}
      {token ? (
        <AccountMenu />
      ) : (
        <Link href="/auth/login" className={props?.className}>
          Log in
        </Link>
      )}
    </div>
  )
}

export const ConfirmLogout = (props?: { className?: string }) => {
  const { user } = useUser()

  return (
    <CleanButton
      className={props?.className}
      onClick={() => {
        let confirmation = confirm("Are you sure you want to sign out?")
        if (confirmation) user?.signOut()
      }}
    >
      Log out
    </CleanButton>
  )
}

/// User Auth page form components
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

interface FormSubmitButtonType {
  form: unstable_FormStateReturn<any | undefined>
  label: string
}

export const FormSubmitButton = ({ form, label }: FormSubmitButtonType) => {
  return (
    <div className={positionButton}>
      <FormSubmit {...form} as={Button} className={loginButton}>
        {label}
      </FormSubmit>
    </div>
  )
}

export const ResetLink = () => {
  const token = useCredentials()

  return (
    <>
      {!token && (
        <span>
          Forgot your password?{" "}
          <Link href="/auth/reset-password">Reset password</Link>
        </span>
      )}
    </>
  )
}

export const SignupLink = () => {
  return (
    <>
      <span>
        Dont have an account? <Link href="/auth/signup">Sign Up</Link>
      </span>
    </>
  )
}

export const LoginLink = () => {
  return (
    <>
      <span>
        Already have an account? <Link href="/auth/login">Log in</Link>
      </span>
    </>
  )
}
