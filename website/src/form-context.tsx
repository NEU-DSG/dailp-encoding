import React, { createContext, useContext, useState } from "react"
import {
  unstable_FormStateReturn as FormStateReturn,
  unstable_useFormState as useFormState,
} from "reakit/Form"
import {
  AnnotatedFormUpdate,
  FormFieldsFragment,
  MorphemeSegmentUpdate,
  useUpdateWordMutation,
} from "./graphql/dailp"

type FormContextType = {
  form: FormStateReturn<any | undefined>
  isEditing: boolean
  setIsEditing: (bool: boolean) => void
}

const FormContext = createContext<FormContextType>({} as FormContextType)

// Instantiates a form state used to keep track of the current word and information about all its features.
export const FormProvider = (props: { children: any }) => {
  const [isEditing, setIsEditing] = useState(false)
  const word: FormFieldsFragment = {} as FormFieldsFragment

  const [updateWordResult, updateWord] = useUpdateWordMutation()

  /** Calls the backend GraphQL mutation to update a word. */
  const runUpdate = async (variables: { word: AnnotatedFormUpdate }) => {
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

      // Create an array of MorphemeSegmentUpdate type to send to the backend.
      const updatedSegments: Array<MorphemeSegmentUpdate> = values.word[
        "segments"
      ].map((segment) => {
        return {
          morpheme: segment.morpheme,
          gloss: segment.gloss,
          role: segment.role,
        }
      })

      runUpdate({
        word: {
          id: values.word["id"],
          docId: values.word["position"].documentId,
          source: values.word["source"],
          commentary: values.word["commentary"],
          segments: updatedSegments,
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
