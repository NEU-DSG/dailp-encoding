import React, { ReactNode, createContext, useContext, useState } from "react"
import {
  unstable_FormStateReturn as FormStateReturn,
  unstable_useFormState as useFormState,
} from "reakit"
import * as Dailp from "../../../graphql/dailp"

type FormContextType = {
  paragraphForm: FormStateReturn<any | undefined>
  isEditingParagraph: boolean
  setIsEditingParagraph: (bool: boolean) => void
}

const ParagraphFormContext = createContext<FormContextType>(
  {} as FormContextType
)

// Instantiates a form state used to keep track of the current word and information about all its features.
export const FormProvider = (props: { children: ReactNode }) => {
  const [isEditingParagraph, setIsEditingParagraph] = useState(false)
  const paragraph: Dailp.ParagraphFormFieldsFragment =
    {} as Dailp.ParagraphFormFieldsFragment

  const [updateParagraphResult, updateParagraph] =
    Dailp.useUpdateParagraphMutation()

  const runUpdate = async (variables: { paragraph: Dailp.ParagraphUpdate }) => {
    return await updateParagraph(variables)
  }

  const paragraphForm = useFormState({
    values: {
      paragraph,
    },
    onValidate: (values) => {
      if (!values || !values.paragraph) {
        throw { values: "No paragraph found" }
      }
    },
    onSubmit: (values) => {
      setIsEditingParagraph(false)

      runUpdate({
        paragraph: {
          id: values.paragraph["id"],
          translation: values.paragraph["translation"],
        },
      })
    },
  })

  return (
    <ParagraphFormContext.Provider
      value={{ paragraphForm, isEditingParagraph, setIsEditingParagraph }}
    >
      {props.children}
    </ParagraphFormContext.Provider>
  )
}

export const useForm = () => {
  const context = useContext(ParagraphFormContext)
  if (!context) {
    console.log("useForm must be used within a FormProvider")
  }
  return context
}
