import React, { ReactNode, createContext, useContext, useState } from "react"
import {
  unstable_FormStateReturn as FormStateReturn,
  unstable_useFormState as useFormState,
} from "reakit"
import { useEditWordCheckContext } from "./edit-word-check-context"
import * as Dailp from "src/graphql/dailp"
import { usePreferences } from "src/preferences-context"

type FormContextType = {
  form: FormStateReturn<any | undefined>
  isEditing: boolean
  setIsEditing: (bool: boolean) => void
  originalSegmentCount: number
  setOriginalSegmentCount: (count: number) => void
}

const WordFormContext = createContext<FormContextType>({} as FormContextType)

// Instantiates a form state used to keep track of the current word and information about all its features.
export const FormProvider = (props: { children: ReactNode }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [originalSegmentCount, setOriginalSegmentCount] = useState(0)
  const word: Dailp.FormFieldsFragment = {} as Dailp.FormFieldsFragment

  const [updateWordResult, updateWord] = Dailp.useUpdateWordMutation()

  const { cherokeeRepresentation } = usePreferences()

  const { romanizedSource } = useEditWordCheckContext()
  const { confirmRomanizedSourceDelete, setConfirmRomanizedSourceDelete } =
    useEditWordCheckContext()

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
      // Only validate on submit attempt, not on field updates
      if (form.submitFailed) {
        if (!values || !values.word) {
          throw { values: "No word found" }
        }
      }
    },
    onSubmit: (values) => {
      if (
        !values.word.romanizedSource &&
        romanizedSource !== "" &&
        !confirmRomanizedSourceDelete
      ) {
        const errors = {
          romanizedSource: "romanizedSource Deleted Error Thrown",
        }
        throw errors
      }
      // Add validation check here before proceeding with submit
      if (!values || !values.word) {
        throw { values: "No word found" }
      }

      // Check if segments were deleted
      if (values.word.segments.length < originalSegmentCount) {
        const confirmDelete = window.confirm(
          "You have deleted word parts. This change will be permanent. Are you sure you want to save?"
        )
        if (!confirmDelete) {
          return
        }
      }

      if (cherokeeRepresentation === Dailp.CherokeeOrthography.Taoc) {
        setIsEditing(false)

        // Create a completely new word state
        const wordUpdate: Dailp.AnnotatedFormUpdate = {
          id: values.word["id"],
          source: values.word["source"],
          commentary: values.word["commentary"],
          segments: values.word["segments"].map((segment) => ({
            system: cherokeeRepresentation,
            morpheme: segment.morpheme,
            gloss: segment.gloss,
            role: segment.role,
          })),
          romanizedSource: values.word["romanizedSource"],
          englishGloss: Array.isArray(values.word["englishGloss"])
            ? values.word["englishGloss"].join(" ")
            : String(values.word["englishGloss"]),
        }

        console.log("Sending complete word update:", wordUpdate)

        runUpdate({
          word: wordUpdate,
          morphemeSystem: cherokeeRepresentation,
        }).then(({ data, error }) => {
          if (error) {
            console.log("Update error:", error)
          } else if (data) {
            console.log("Server response:", data.updateWord)
            form.update("word", data.updateWord)
          }
          setConfirmRomanizedSourceDelete(false)
        })
      } else {
        alert(settingsAlert)
      }
    },
  })

  return (
    <WordFormContext.Provider
      value={{
        form,
        isEditing,
        setIsEditing,
        originalSegmentCount,
        setOriginalSegmentCount,
      }}
    >
      {props.children}
    </WordFormContext.Provider>
  )
}

export const useForm = () => {
  const context = useContext(WordFormContext)

  return context
}
