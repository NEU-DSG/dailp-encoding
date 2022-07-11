import React, { createContext, useContext, useState } from "react"
import {
  unstable_FormStateReturn as FormStateReturn,
  unstable_useFormState as useFormState,
} from "reakit/Form"
import {
  AnnotatedFormUpdate,
  FormFieldsFragment,
  useUpdateWordMutation,
} from "./graphql/dailp"

type FormContextType = {
  form: FormStateReturn<any | undefined>
  isEditing: boolean
  setIsEditing: (bool: boolean) => void
}

const FormContext = createContext<FormContextType>({} as FormContextType)

/** Instantiates a form state used to keep track of the current word and information about all its features. */
export const FormProvider = (props: { children: any }) => {
  const [isEditing, setIsEditing] = useState(false)
  const word: FormFieldsFragment | undefined = undefined

  const [updateWordResult, updateWord] = useUpdateWordMutation()

  /** Calls the backend GraphQL mutation to update a word. */
  const runUpdate = (variables: { word: AnnotatedFormUpdate }) => {
    updateWord(variables).then((result) => {
      console.log(result.data)
    })
  }

  const form = useFormState({
    values: {
      word,
    },
    onValidate: (values) => {},
    onSubmit: (values) => {
      if (!values.word) {
        throw { values: { word: "No word found" } }
      }

      setIsEditing(false)

      runUpdate({
        word: {
          id: values.word["id"],
          source: values.word["source"],
          commentary: values.word["commentary"],
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
