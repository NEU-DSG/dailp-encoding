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
  const document: Dailp.DocumentMetadataUpdate = {} as Dailp.DocumentMetadataUpdate

  const [updateDocResult, updateDoc] = Dailp.useUpdateDocumentMetadataMutation()

  /** Calls the backend GraphQL mutation to update a document's metadata. */
  const runUpdate = async (variables: { document: Dailp.DocumentMetadataUpdate }) => {
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
      setIsEditing(false)

      runUpdate({
        document: {
            id: values.document["id"],
            title: values.document["title"],
            audioSliceId: values.document["audioSliceId"],
            groupId: values.document["groupId"],
            indexInGroup: values.document["indexInGroup"],
            isReference: values.document["isReference"],
            writtenAt: values.document["writtenAt"],
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
