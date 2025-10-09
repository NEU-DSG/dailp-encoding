import cx from "classnames"
import React from "react"
import {
  Button,
  unstable_Form as Form,
  unstable_useFormState as useFormState,
} from "reakit"
import { useUser } from "src/components/auth"
import { button, cleanButton, iconButton } from "src/components/button/button.css"
import { fonts } from "src/style/theme-contract.css"
import {
  FormFields,
  FormSubmitButton,
  UserAuthPageTemplate,
} from "./user-auth-layout"
import {
  centeredForm,
  loginButton,
  positionButton,
  secondaryButton,
} from "./user-auth.css"

const ConfirmationPage = () => {
  const { confirmUser, resetConfirmationCode } = useUser().operations

  const confirmationForm = useFormState({
    values: { email: "", code: "" },
    onValidate: (values) => {
      if (!values.code) {
        throw { code: "A confirmation code is required" }
      }
    },
    onSubmit: (values) => {
      console.log(`Submitted! confirmation code is ${values.code}`)
      confirmUser(values.email, values.code)
    },
  })

  const startCodeReset = () => {
    let email = confirmationForm.values.email
    if (email) {
      resetConfirmationCode(email)
    } else {
      confirmationForm.reset()
      alert("Please enter the email associated with your account.")
    }
  }
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
          name="email"
          label="Email *"
          placeholder="someone@email.com"
        />
        <FormFields
          form={confirmationForm}
          name="code"
          label="Confirmation Code"
          placeholder="123456"
        />

        <span className={fonts.body}>
          Having trouble finding your confirmation code?
          <Button onClick={startCodeReset} className={secondaryButton}>
            Reset Confirmation Code
          </Button>
        </span>

        <FormSubmitButton form={confirmationForm} label="Confirm Me" />
      </Form>
    </UserAuthPageTemplate>
  )
}

export const Page = ConfirmationPage
