import React, { ReactNode, createContext, useContext, useState } from "react"
import {
  unstable_FormStateReturn as FormStateReturn,
  unstable_useFormState as useFormState,
} from "reakit"
import * as Dailp from "./graphql/dailp"

type FormContextType = {
  form: FormStateReturn<any | undefined>
  isEditing: boolean
  setIsEditing: (bool: boolean) => void
}

const FormContext = createContext<FormContextType>({} as FormContextType)

// Instantiates a form state used to keep track of the current word and information about all its features.
export const FormProvider = (props: { children: ReactNode }) => {
  const [isEditing, setIsEditing] = useState(false)
  const paragraph: Dailp.ParagraphFormFieldsFragment =
    {} as Dailp.ParagraphFormFieldsFragment

  const [updateParagraphResult, updateParagraph] =
    Dailp.useUpdateParagraphMutation()

  const runUpdate = async (variables: { paragraph: Dailp.ParagraphUpdate }) => {
    return await updateParagraph(variables)
  }

  const form = useFormState({
    values: {
      paragraph,
    },
    onValidate: (values) => {
      if (!values || !values.paragraph) {
        throw { values: "No paragraph found" }
      }
    },
    onSubmit: (values) => {
      setIsEditing(false)

      runUpdate({
        paragraph: {
          id: values.paragraph["id"][0][0],
          translation: values.paragraph["translation"],
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
