import React from "react"
import {
  unstable_Form as Form,
  unstable_useFormState as useFormState,
} from "reakit"
import { useUser } from "src/auth"
import {
  FormFields,
  FormSubmitButton,
  UserAuthPageTemplate,
} from "./user-auth-layout"
import { centeredForm } from "./user-auth.css"

const VerificationPage = () => {
  const { confirmUser, resetVerificationCode } = useUser().operations

  const verificationForm = useFormState({
    values: { code: "" },
    onValidate: (values) => {
      if (!values.code) {
        throw { code: "A verification code is required" }
      }
    },
    onSubmit: (values) => {
      console.log(`Submitted! verification code is ${values.code}`)
      confirmUser(values.code)
    },
  })

  return (
    <UserAuthPageTemplate
      header={{
        prompt: "Verify your account to continue.",
        description: `
          Please enter the 6-digit confirmation code we just sent to your
          email. It may take a few minutes for you to recieve the email. Be
          sure to check your spam folder if you cannot find the email.`,
      }}
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

        <FormSubmitButton form={verificationForm} label="Verify Me" />
      </Form>
    </UserAuthPageTemplate>
  )
}

export const Page = VerificationPage
