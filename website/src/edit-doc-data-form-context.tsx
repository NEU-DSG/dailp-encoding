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

      runUpdate({
        document: {
          id: values.document["id"][0][0],
          title: values.document["title"],
          writtenAt: values.document["date"]
            ? (values.document["date"] as unknown as Array<any>)[
                (values.document["date"] as unknown as Array<any>).length - 1
              ][0]
            : {},
          format: values.document["format"],
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
