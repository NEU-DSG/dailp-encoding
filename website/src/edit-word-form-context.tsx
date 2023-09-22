import React, { createContext, useContext, useState } from "react"
import {
  unstable_FormStateReturn as FormStateReturn,
  unstable_useFormState as useFormState,
} from "reakit"
import * as Dailp from "./graphql/dailp"
import { usePreferences } from "./preferences-context"

type FormContextType = {
  form: FormStateReturn<any | undefined>
  isEditing: boolean
  setIsEditing: (bool: boolean) => void
}

const FormContext = createContext<FormContextType>({} as FormContextType)

/** Instantiates a form state used to keep track of the current word and information about all its features. */
export const FormProvider = (props: { children: any }) => {
  const [isEditing, setIsEditing] = useState(false)
  const word: Dailp.FormFieldsFragment = {} as Dailp.FormFieldsFragment

  const [updateWordResult, updateWord] = Dailp.useUpdateWordMutation()
  const { cherokeeRepresentation } = usePreferences()

  /** Calls the backend GraphQL mutation to update a word. */
  const runUpdate = async (variables: {
    word: Dailp.AnnotatedFormUpdate
    morphemeSystem: Dailp.CherokeeOrthography
  }) => {
    await updateWord(variables)
  }

  const form = useFormState({
    values: {
      word,
    },
    onValidate: (values) => {
      if (!values || !values.word) {
        throw { values: "No word found" }
      }
    },
    onSubmit: (values) => {
      setIsEditing(false)

      runUpdate({
        word: {
          id: values.word["id"],
          source: values.word["source"],
          commentary: values.word["commentary"],
        },
        morphemeSystem: cherokeeRepresentation,
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
