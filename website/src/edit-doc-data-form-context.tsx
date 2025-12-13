import React, { createContext, useContext, useState } from "react"
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

/** Instantiates a form state used to keep track of the current document and information about all its features. */
export const FormProvider = (props: { children: any }) => {
  const [isEditing, setIsEditing] = useState(false)
  const document: Dailp.DocFormFieldsFragment =
    {} as Dailp.DocFormFieldsFragment

  const [updateDocResult, updateDoc] = Dailp.useUpdateDocumentMetadataMutation()

  /** Calls the backend GraphQL mutation to update a document's metadata. */
  const runUpdate = async (variables: {
    document: Dailp.DocumentMetadataUpdate
  }) => {
    await updateDoc(variables)
  }

  const form = useFormState({
    values: {
      document,
    },
    onValidate: (values) => {
      if (!values || !values.document) {
        throw { values: "No document found" }
      }
    },
    onSubmit: (values) => {
      // console.log("SUBMITTING")
      // console.log(values.document["id"][0][0])
      // console.log(values.document["title"])
      // console.log(typeof values.document["date"])
      setIsEditing(false)

      // Handle date
      let writtenAtValue: Dailp.DateInput | null = null
      const dateValue = values.document["date"]

      if (dateValue) {
        if (typeof dateValue === "string") {
          const yearNum = parseInt(dateValue)
          if (!isNaN(yearNum)) {
            writtenAtValue = { year: yearNum, month: 1, day: 1 } // Default to Jan 1 if only year (for now)
          }
        } else if (typeof dateValue === "object" && "year" in dateValue) {
          writtenAtValue = {
            year: dateValue.year,
            month: dateValue.month || 1,
            day: dateValue.day || 1,
          }
        }
      }

      runUpdate({
        document: {
          id: values.document["id"][0][0],
          title: values.document["title"],
          writtenAt: writtenAtValue,
          format: values.document["format"],
          keywords: values.document["keywords"] ?? [],
          languages: values.document["languages"] ?? [],
          subjectHeadings: values.document["subjectHeadings"] ?? [],
          contributors: values.document["contributors"] ?? [],
          spatialCoverage: values.document["spatialCoverage"] ?? [],
          creators: values.document["creators"] ?? [],
          genre: values.document["genre"],
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
