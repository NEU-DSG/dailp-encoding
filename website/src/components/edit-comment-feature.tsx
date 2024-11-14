import React, { createContext, useContext, useState } from "react"
import { HiPencilAlt } from "react-icons/hi/index"
import { IoCheckmarkSharp } from "react-icons/io5/index"
import {
  unstable_Form as Form,
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
  unstable_FormSubmitButton as FormSubmitButton,
} from "reakit"
import * as Dailp from "src/graphql/dailp"
import { UserRole, useUserRole } from "../auth"
import { IconButton } from "../components"
import { IconTextButton } from "../components/button"
import * as css from "../edit-word-feature.css"
import { useForm } from "./edit-comment-form-context"

/** Button that allows user to enter edit mode in the word panel, and edit fields of a word. */
export const EditButton = (props: { commentId: string }) => {
  const { commentForm, isEditingComment, setIsEditingComment } = useForm()

  return (
    <Form {...commentForm} className={css.form}>
      {isEditingComment === props.commentId ? (
        // Displays a "Cancel" button and "Save" button in editing mode.
        <>
          <IconButton
            className={css.cancelButtonSmall}
            round={false}
            onClick={() => {
              setIsEditingComment("")
              // console.log(isEditingComment)
            }}
          >
            Cancel
          </IconButton>

          <IconTextButton
            {...commentForm}
            icon={<IoCheckmarkSharp />}
            className={css.editPanelButtonSmall}
            as={FormSubmitButton}
          >
            Save
          </IconTextButton>
        </>
      ) : (
        <IconTextButton
          icon={<HiPencilAlt />}
          className={css.editPanelButtonSmall}
          onClick={() => {
            setIsEditingComment(props.commentId)
            // console.log(isEditingComment)
          }}
        >
          Edit
        </IconTextButton>
      )}
    </Form>
  )
}

interface CommentValueContextType {
  commentValues: {
    id: string
    textContent: string
    commentType: string
    edited: boolean
  }
  setCommentValues: React.Dispatch<
    React.SetStateAction<{
      id: string
      textContent: string
      commentType: string
      edited: boolean
    }>
  >
}

const CommentValueContext = createContext<CommentValueContextType | null>(null)

export const CommentValueProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [commentValues, setCommentValues] = useState({
    id: "",
    textContent: "",
    commentType: "STORY",
    edited: true,
  })

  return (
    <CommentValueContext.Provider value={{ commentValues, setCommentValues }}>
      {children}
    </CommentValueContext.Provider>
  )
}

export const useCommentValueContext = () => {
  const context = useContext(CommentValueContext)
  if (!context) {
    throw new Error(
      "useCommentValueContext must be used within a CommentValueProvider"
    )
  }
  return context
}
