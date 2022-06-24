import React from "react"
import { setUserAgent } from "react-device-detect"
import { Button } from "reakit/Button"
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
import { centeredColumn, cleanButton } from "src/sprinkles.css"
import Layout from "../layout"
import {
  centeredForm,
  linkStyle,
  loginButton,
  loginFormBox,
  loginHeader,
  logoutPopover,
  positionButton,
  skinnyWidth,
} from "./login.css"
import { ResetLink } from "./reset-password.page"

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
    <Layout>
      <main className={skinnyWidth}>
        <header className={centeredColumn}>
          <h1>Login to Your Account</h1>
          <h4>
            Login to contribute to the archive by transcribing documents,
            recording pronunciations, providing cultural commentary, and more.
          </h4>
        </header>

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
            <FormSubmitButton {...loginForm} className={loginButton}>
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
  const { authenticated } = useUser()

  return (
    <div className={loginHeader}>
      {/* show a logout button if user is signed in, otherwise show login */}
      {authenticated ? (
        <ConfirmLogout />
      ) : (
        <Link className={linkStyle} href="/login">
          Log in
        </Link>
      )}
    </div>
  )
}

// a popover handling user log out
const ConfirmLogout = () => {
  const { user, setUser } = useUser()
  const popover = usePopoverState()

  return (
    <>
      <PopoverDisclosure {...popover} className={cleanButton}>
        Log out
      </PopoverDisclosure>
      <Popover {...popover} className={logoutPopover} tabIndex={0}>
        Log out of DAILP?
        <Button
          className={cleanButton}
          onClick={() => {
            user?.signOut()
            setUser(null)
          }}
        >
          Yes
        </Button>
        <Button
          className={cleanButton}
          onClick={() => {
            popover.hide()
          }}
        >
          No
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
