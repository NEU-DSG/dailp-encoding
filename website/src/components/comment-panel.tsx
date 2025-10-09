import React, { SetStateAction, useEffect } from "react"
import * as Dailp from "src/graphql/dailp"
import * as css from "./comment-panel.css"
import { useCommentValueContext } from "./edit-comment-feature"
import { Button } from "./index"
import { TranslatedParagraph } from "./segment"

// The type of comment panel that is displayed.
export enum CommentAction {
  PostComment = "PostComment",
  EditComment = "EditComment",
}

// Displays the comment panel for a selected segment.
export const CommentPanel = (p: {
  segment: Dailp.FormFieldsFragment | TranslatedParagraph
  setIsCommenting: React.Dispatch<SetStateAction<boolean>>
  commentAction: CommentAction
  commentObject?: Dailp.CommentFieldsFragment
}) => {
  const { commentValues, setCommentValues } = useCommentValueContext()
  useEffect(() => {
    setCommentValues((prev) => ({
      ...prev,
      id: p.commentObject?.id.toString() ?? "",
      textContent: p.commentObject?.textContent ?? "",
      commentType: p.commentObject?.commentType ?? "STORY",
    }))
  }, [p.commentObject?.id])

  const [postCommentResult, postComment] = Dailp.usePostCommentMutation()
  const [editCommentResult, editComment] = Dailp.useUpdateCommentMutation()

  const commentTypeNames: Record<Dailp.CommentType, string> = {
    // ... TS will then make sure you have an entry for everything on the "CommentTag" type that you import from the codegen
    [Dailp.CommentType.Story]: "Story",
    [Dailp.CommentType.Suggestion]: "Suggestion",
    [Dailp.CommentType.Question]: "Question",
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentValues({
      ...commentValues,
      textContent: event.target.value,
    })
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCommentValues({
      ...commentValues,
      commentType: event.target.value,
    })
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const handleError = (error: any, action: string) => {
      if (error) {
        console.error(error)
        alert(`Something went wrong ${action}`)
      } else {
        console.log("Submitted!")
        alert(`Your comment has been ${action}`)
        p.setIsCommenting(false)
      }
    }

    if (commentValues.textContent && commentValues.commentType) {
      if (p.commentAction === CommentAction.PostComment) {
        const { error: postError } = await postComment({
          input: {
            parentId: p.segment.id,
            parentType:
              p.segment.__typename === "DocumentParagraph"
                ? Dailp.CommentParentType.Paragraph
                : Dailp.CommentParentType.Word,
            textContent: commentValues.textContent,
            commentType: commentValues.commentType as Dailp.CommentType,
          },
        })
        handleError(postError, "posted")
      }
    } else {
      alert("Please add a comment before submitting.")
    }
  }

  return (
    <div>
      {!(p.commentAction === CommentAction.EditComment) ? (
        <header className={css.wordPanelHeader}>
          <h2 className={css.editCherHeader}>
            {p.segment.__typename === "DocumentParagraph"
              ? "Paragraph " + p.segment?.index
              : p.segment.source}
          </h2>
        </header>
      ) : (
        <></>
      )}

      <form>
        <textarea
          placeholder="Add a comment..."
          value={commentValues.textContent}
          onChange={handleInputChange}
          className={css.inputStyling}
        />
        <div>
          <label htmlFor="dropdown" className={css.spacing}>
            Tag:
          </label>
          <select
            id="dropdown"
            value={commentValues.commentType}
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
        {!(p.commentAction === CommentAction.EditComment) ? (
          <Button
            type="button"
            className={css.commentButton}
            onClick={handleSubmit}
          >
            Save
          </Button>
        ) : (
          <></>
        )}
      </form>
    </div>
  )
}

export default CommentPanel
