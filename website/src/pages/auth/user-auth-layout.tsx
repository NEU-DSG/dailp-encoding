import cx from "classnames"
import React, { ReactNode, useEffect, useState } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md/index"
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
import { Environment, deploymentEnvironment } from "src/env"
import { centeredColumn } from "src/style/utils.css"
import Layout from "../../layout"
import {
  centeredHeader,
  loginButton,
  loginFormBox,
  loginHeader,
  passwordInput,
  passwordVisibilityToggle,
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



/// User Auth page form components
interface FormFieldsType {
  form: unstable_FormStateReturn<any | undefined>
  name: any
  label?: string
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

      {type === "password" ? (
        <PasswordInput form={form} name={name} placeholder={placeholder} />
      ) : (
        <FormInput
          {...form}
          name={name}
          className={loginFormBox}
          type={type}
          placeholder={placeholder}
        />
      )}

      <FormMessage {...form} name={name} />
    </>
  )
}

/*
A field for entering password with the ability to show or hide the password.
Visibility toggle follows Microsoft's password reveal pattern–
when the password is hidden the user can click the eye button to show the password and
when the password is shown the user can click the slashed eye button to hide the password.
*/
const PasswordInput = ({ form, name, placeholder }: FormFieldsType) => {
  let visibleIcon = <MdVisibility size={20} />
  let visibleOffIcon = <MdVisibilityOff size={20} />
  const [password, setPassword] = useState("")
  const [type, setType] = useState("password")
  const [icon, setIcon] = useState(visibleIcon)
  const handleToggle = () => {
    if (type === "password") {
      setIcon(visibleOffIcon)
      setType("text")
    } else {
      setIcon(visibleIcon)
      setType("password")
    }
  }
  return (
    <span>
      <FormInput
        {...form}
        name={name}
        className={cx(loginFormBox, passwordInput)}
        type={type}
        placeholder={placeholder}
        value={password}
        onChange={(e: { target: { value: React.SetStateAction<string> } }) => {
          setPassword(e.target.value)
        }}
      />
      <span onClick={handleToggle} className={passwordVisibilityToggle}>
        {icon}
      </span>
    </span>
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
