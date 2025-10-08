import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  unstable_FormStateReturn as FormStateReturn,
  unstable_useFormState as useFormState,
} from "reakit"
import * as Dailp from "../../../graphql/dailp"
import { useCommentValueContext } from "./edit-comment-feature"

type FormContextType = {
  commentForm: FormStateReturn<any | undefined>
  isEditingComment: string
  setIsEditingComment: (id: string) => void
}

const CommentFormContext = createContext<FormContextType>({} as FormContextType)

// Instantiates a form state used to keep track of the current word and information about all its features.
export const FormProvider = (props: { children: ReactNode }) => {
  const { commentValues } = useCommentValueContext()
  const [isEditingComment, setIsEditingComment] = useState("")
  const [comment, setComment] = useState<Dailp.CommentFormFieldsFragment>(
    commentValues as Dailp.CommentFormFieldsFragment
  )
  useEffect(() => {
    const newComment = commentValues as Dailp.CommentFormFieldsFragment
    setComment(newComment)
    commentForm.values.comment = newComment
  }, [commentValues])

  const [updateCommentResult, updateComment] = Dailp.useUpdateCommentMutation()

  const runUpdate = async (variables: { comment: Dailp.CommentUpdate }) => {
    return await updateComment(variables)
  }

  const commentForm = useFormState({
    values: {
      comment,
    },
    onValidate: (values) => {
      if (!values || !values.comment) {
        throw { values: "No comment found" }
      }
    },
    onSubmit: (values) => {
      setIsEditingComment("")

      runUpdate({
        comment: {
          id: values.comment["id"],
          textContent: values.comment["textContent"],
          commentType: values.comment["commentType"],
          edited: values.comment["edited"],
        },
      })
    },
  })

  return (
    <CommentFormContext.Provider
      value={{ commentForm, isEditingComment, setIsEditingComment }}
    >
      {props.children}
    </CommentFormContext.Provider>
  )
}

export const useForm = () => {
  const context = useContext(CommentFormContext)
  if (!context) {
    console.log("useForm must be used within a FormProvider")
  }
  return context
}
