import React, { ReactNode, createContext, useContext, useState } from "react"
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

const WordFormContext = createContext<FormContextType>({} as FormContextType)

// Instantiates a form state used to keep track of the current word and information about all its features.
export const FormProvider = (props: { children: ReactNode }) => {
  const [isEditing, setIsEditing] = useState(false)
  const word: Dailp.FormFieldsFragment = {} as Dailp.FormFieldsFragment

  const [updateWordResult, updateWord] = Dailp.useUpdateWordMutation()

  const { cherokeeRepresentation } = usePreferences()

  const settingsAlert =
    "Currently, only the linguistic analysis using terms from Tone and Accent in Oklahoma Cherokee (TAOC) is supported for editing. Please update your Cherokee description style in the display settings."

  /** Calls the backend GraphQL mutation to update a word. */
  const runUpdate = async (variables: {
    word: Dailp.AnnotatedFormUpdate
    morphemeSystem: Dailp.CherokeeOrthography
  }) => {
    return await updateWord(variables)
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
      if (cherokeeRepresentation === Dailp.CherokeeOrthography.Taoc) {
        setIsEditing(false)

        // Create an array of MorphemeSegmentUpdate type to send to the backend.
        const updatedSegments: Array<Dailp.MorphemeSegmentUpdate> = values.word[
          "segments"
        ].map((segment) => ({
          system: cherokeeRepresentation,
          morpheme: segment.morpheme,
          gloss: segment.gloss,
          role: segment.role,
        }))

        runUpdate({
          word: {
            id: values.word["id"],
            source: values.word["source"],
            commentary: values.word["commentary"],
            segments: updatedSegments,
            englishGloss: values.word["englishGloss"],
          },
          morphemeSystem: cherokeeRepresentation,
        }).then(({ data, error }) => {
          if (error) {
            console.log(error)
          }
        })
      } else {
        alert(settingsAlert)
      }
    },
  })

  return (
    <WordFormContext.Provider value={{ form, isEditing, setIsEditing }}>
      {props.children}
    </WordFormContext.Provider>
  )
}

export const useForm = () => {
  const context = useContext(WordFormContext)

  return context
}
