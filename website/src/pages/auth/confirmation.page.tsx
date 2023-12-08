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

const ConfirmationPage = () => {
  const { confirmUser, resetConfirmationCode } = useUser().operations

  const confirmationForm = useFormState({
    values: { code: "" },
    onValidate: (values) => {
      if (!values.code) {
        throw { code: "A confirmation code is required" }
      }
    },
    onSubmit: (values) => {
      console.log(`Submitted! confirmation code is ${values.code}`)
      confirmUser(values.code)
    },
  })

  return (
    <UserAuthPageTemplate
      header={{
        prompt: "Confirm your account to continue.",
        description: `
          Please enter the 6-digit confirmation code we just sent to your
          email. It may take a few minutes for you to recieve the email. Be
          sure to check your spam folder if you cannot find the email.`,
      }}
    >
      <Form {...confirmationForm} className={centeredForm}>
        <FormFields
          form={confirmationForm}
          name="code"
          label="Confirmation Code *"
          placeholder="123456"
        />

        <label>
          <a onClick={resetConfirmationCode}>Request a new code</a>
        </label>

        <FormSubmitButton form={confirmationForm} label="Confirm Me" />
      </Form>
    </UserAuthPageTemplate>
  )
}

export const Page = ConfirmationPage
