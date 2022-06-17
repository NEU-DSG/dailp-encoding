import { CognitoUser } from "amazon-cognito-identity-js"
import React from "react"
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
import { useUser } from "src/auth"
import Link from "src/components/link"
import { centeredColumn } from "src/sprinkles.css"
import Layout from "../layout"
import {
  centeredForm,
  loginFormBox,
  loginHeader,
  logoutPopover,
  positionButton,
  skinnyWidth,
  submitButton,
} from "./login.css"
import { ResetLink } from "./reset-password.page"

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
    </>
  )
}

const LoginPage = () => {
  const { loginUser } = useUser().operations

  const loginForm = useFormState({
    values: { username: "", password: "" },
    onValidate: (values) => {
      if (!values.username || !values.password) {
        throw (
          (!values.username && { username: "A username is required" }) || {
            password: "A password is required",
          }
        )
      }
    },
    onSubmit: (values) => {
      loginUser(values.username, values.password)
    },
  })

  return (
    <Layout>
      <main className={skinnyWidth}>
        <header>
          <h1 className={centeredColumn}>Login to Your Account</h1>
          <h4>
            Login to contribute to the archive by transcribing documents,
            recording pronunciations, providing cultural commentary, and more.
          </h4>
        </header>

        <Form {...loginForm} className={centeredForm}>
          <FormFields
            form={loginForm}
            name="username"
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

          <FormMessage {...loginForm} name="username" />
          <FormMessage {...loginForm} name="password" />

          <ResetLink />

          <div className={positionButton}>
            <FormSubmitButton {...loginForm} className={submitButton}>
              Log in
            </FormSubmitButton>
          </div>
        </Form>
      </main>
    </Layout>
  )
}

// the login button that appears in the header of the website
export const LoginHeaderButton = () => {
  const { user } = useUser()
  const { logoutUser } = useUser().operations

  return (
    <>
      <div className={loginHeader}>
        {/* show a logout button if user is signed in, otherwise show login */}
        {user != null ? (
          <ConfirmLogout user={user} logoutUser={logoutUser} />
        ) : (
          <Link href="/login">Log in</Link>
        )}
      </div>
    </>
  )
}

// a popover handling user log out
const ConfirmLogout = (props: {
  user: CognitoUser
  logoutUser: (user: CognitoUser) => void
}) => {
  const popover = usePopoverState()

  return (
    <>
      <PopoverDisclosure {...popover}>Log out</PopoverDisclosure>
      <Popover {...popover} tabIndex={0}>
        <div className={logoutPopover}>
          <div>Log out of DAILP?</div>
          <Link
            href=""
            onClick={(e) => {
              e.preventDefault()
              props.logoutUser(props.user)
            }}
          >
            Yes
          </Link>
          <Link
            href=""
            onClick={(e) => {
              e.preventDefault()
              popover.hide()
            }}
          >
            No
          </Link>
        </div>
      </Popover>
    </>
  )
}

export default LoginPage
