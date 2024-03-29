import React, { ReactNode, SetStateAction } from "react"
import { useState } from "react"
import * as Dailp from "src/graphql/dailp"
import * as css from "./comment-panel.css"
import { Button } from "./components"
import { TranslatedParagraph } from "./segment"

export const CommentPanel = (p: {
  segment: Dailp.FormFieldsFragment | TranslatedParagraph
  setIsCommenting: React.Dispatch<SetStateAction<boolean>>
}) => {
  const [newCommentText, setNewCommentText] = useState<string>("")
  const [newCommentType, setNewCommentType] = useState<string>("STORY")

  const [postCommentResult, postComment] = Dailp.usePostCommentMutation()

  const commentTypeNames: Record<Dailp.CommentType, string> = {
    // ... TS will then make sure you have an entry for everything on the "CommentTag" type that you import from the codegen
    [Dailp.CommentType.Story]: "Story",
    [Dailp.CommentType.Suggestion]: "Suggestion",
    [Dailp.CommentType.Question]: "Question",
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewCommentText(event.target.value)
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewCommentType(event.target.value)
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (newCommentText && newCommentType) {
      const { error } = await postComment({
        input: {
          parentId: p.segment.id,
          parentType:
            p.segment.__typename === "DocumentParagraph"
              ? Dailp.CommentParentType.Paragraph
              : Dailp.CommentParentType.Word,
          textContent: newCommentText,
          commentType: newCommentType as Dailp.CommentType,
        },
      })
      if (error) {
        console.error(error)
        alert("Something went wrong posting your comment")
      } else {
        console.log("Submitted!")
        alert("Your comment has been posted!")
        p.setIsCommenting(false)
      }
    } else {
      alert("Please add a comment before submitting.")
    }
  }

  return (
    <div>
      <header className={css.wordPanelHeader}>
        <h2 className={css.editCherHeader}>
          {p.segment.__typename === "DocumentParagraph"
            ? "Paragraph " + p.segment?.index
            : p.segment.source}
        </h2>
      </header>
      <form>
        <textarea
          placeholder="Add a comment..."
          value={newCommentText}
          onChange={handleInputChange}
          className={css.inputStyling}
        />
        <div>
          <label htmlFor="dropdown" className={css.spacing}>
            Tag:
          </label>
          <select
            id="dropdown"
            value={newCommentType}
            onChange={handleSelectChange}
            className={css.spacing}
          >
            {Object.entries<string>(commentTypeNames).map(([option, label]) => (
              <option key={option} value={option}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="button"
          className={css.commentButton}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </form>
    </div>
  )
}

export default CommentPanel
