import React, { createContext, useContext, useState } from "react"
import {
  unstable_FormStateReturn as FormStateReturn,
  unstable_useFormState as useFormState,
} from "reakit"
import * as Dailp from "../../graphql/dailp"

type FormContextType = {
  form: FormStateReturn<any | undefined>
  isEditing: boolean
  setIsEditing: (bool: boolean) => void
}

const FormContext = createContext<FormContextType>({} as FormContextType)

/** Instantiates a form state used to keep track of the current document and information about all its features. */
export const FormProvider = (props: { children: any }) => {
  const [isEditing, setIsEditing] = useState(false)
  const user: Dailp.UserCreateFormFieldsFragment =
    {} as Dailp.UserCreateFormFieldsFragment

  const [insertDailpUserResult, insertDailpUser] =
    Dailp.useInsertDailpUserMutation()

  /** Calls the backend GraphQL mutation to update a document's metadata. */
  const runUpdate = async (variables: { user: Dailp.UserCreate }) => {
    await insertDailpUser(variables)
  }

  const form = useFormState({
    values: {
      user,
    },
    onValidate: (values) => {
      if (!values || !values.user) {
        throw { values: "No user information found" }
      }
    },
    onSubmit: (values) => {
      setIsEditing(false)

      runUpdate({
        user: {
          displayName: values.user["displayName"],
          avatarUrl: values.user["avatarUrl"],
          bio: values.user["bio"],
          organization: values.user["organization"],
          location: values.user["location"],
          role: values.user["role"],
        },
      })
    },
  })

  return (
    <FormContext.Provider value={{ form, isEditing, setIsEditing }}>
      {props.children}
    </FormContext.Provider>
  )
}

export const useForm = () => {
  const context = useContext(FormContext)

  return context
}
