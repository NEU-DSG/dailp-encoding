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

/** Instantiates a form state used to keep track of the current user and information about all its features. */
export const FormProvider = (props: { children: any }) => {
  const [isEditing, setIsEditing] = useState(false)
  const user: Dailp.User = {} as Dailp.User

  const [updateUserResult, updateUser] = Dailp.useUpdateCurrentUserMutation()

  /** Calls the backend GraphQL mutation to update a user's profile data. */
  const runUpdate = async (variables: { user: Dailp.CurrentUserUpdate }) => {
    await updateUser(variables)
  }

  const form = useFormState({
    values: {
      user,
    },
    onValidate: (values) => {
      if (!values || !values.user) {
        throw { values: "No user found" }
      }
    },
    onSubmit: (values) => {
      console.log("Submitting user profile update")
      console.log(values.user.displayName)
      console.log(values.user.avatarUrl)
      console.log(values.user.bio)
      console.log(values.user.organization)
      console.log(values.user.location)
      setIsEditing(false)

      runUpdate({
        user: {
          displayName: values.user.displayName,
          avatarUrl: values.user.avatarUrl,
          bio: values.user.bio,
          organization: values.user.organization,
          location: values.user.location,
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
