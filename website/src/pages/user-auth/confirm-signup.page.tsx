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
import { useCredentials, useUser } from "src/auth"
import { Button, Link } from "src/components"
import Layout from "../../layout"
import {
  centeredForm,
  centeredHeader,
  loginButton,
  loginFormBox,
  positionButton,
  skinnyWidth,
} from "./user-auth.css"

export const VerificationPageTemplate = (props: {
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

const VerificationPage = () => {
  const { verifyUser, resetVerificationCode } = useUser().operations

  const verificationForm = useFormState({
    values: { code: "" },
    onValidate: (values) => {
      if (!values.code) {
        throw { code: "A verification code is required" }
      }
    },
    onSubmit: (values) => {
      console.log(`Submitted! verification code is ${values.code}`)
      verifyUser(values.code)
    },
  })

  return (
    <VerificationPageTemplate
      header={
        <>
          <h1>Verify your account to continue.</h1>
          <h4>
            Please enter the 6-digit confirmation code we just sent to your
            email. It may take a few minutes for you to recieve the email. Be
            sure to check your spam folder if you cannot find the email.
          </h4>
        </>
      }
    >
      <Form {...verificationForm} className={centeredForm}>
        <FormFields
          form={verificationForm}
          name="code"
          label="Verification Code *"
          placeholder="123456"
        />

        <label>
          <a onClick={resetVerificationCode}>Request a new code</a>
        </label>

        <div className={positionButton}>
          <FormSubmitButton
            {...verificationForm}
            as={Button}
            className={loginButton}
          >
            Verify Me
          </FormSubmitButton>
        </div>
      </Form>
    </VerificationPageTemplate>
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

export const Page = VerificationPage
