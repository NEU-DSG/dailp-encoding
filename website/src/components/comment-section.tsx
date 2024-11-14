import React, { useEffect, useState } from "react"
import { useCommentStateContext } from "src/comment-state-context"
import * as Dailp from "src/graphql/dailp"
import { TranslatedParagraph } from "src/segment"
import { useCognitoUserGroups, useCredentials } from "../auth"
import { CommentAction, CommentPanel } from "../comment-panel"
import * as css from "./comment-section.css"
import {
  EditButton as CommentEditButton,
  CommentValueProvider,
} from "./edit-comment-feature"
import {
  FormProvider as FormProviderComment,
  useForm,
} from "./edit-comment-form-context"

export const CommentSection = (p: {
  parent: Dailp.FormFieldsFragment | TranslatedParagraph
}) => {
  return (
    <FormProviderComment>
      <div>
        {p.parent.__typename === "DocumentParagraph" ? (
          <ParagraphCommentSection paragraph={p.parent} />
        ) : p.parent.__typename === "AnnotatedForm" ? (
          <WordCommentSection word={p.parent} />
        ) : (
          ""
        )}
      </div>
    </FormProviderComment>
  )
}

export const WordCommentSection = (p: { word: Dailp.FormFieldsFragment }) => {
  const [{ data }] = Dailp.useWordCommentsQuery({
    variables: { wordId: p.word.id },
  })
  const token = useCredentials()
  const userGroups = useCognitoUserGroups()
  const { commentForm, isEditingComment } = useForm()
  const { isCommenting, setIsCommenting } = useCommentStateContext()

  const wordComments = data?.wordById.comments

  // Only show the edit button if user is in a group that can edit comments.
  return (
    <div>
      {wordComments?.map((comment) => (
        <div>
          {!(isEditingComment === comment.id) ? (
            <>
              <CommentHeader comment={comment} />
              <CommentBody comment={comment} />
            </>
          ) : (
            <>
              <CommentPanel
                segment={p.word}
                setIsCommenting={setIsCommenting}
                commentAction={CommentAction.EditComment}
                commentObject={comment}
              />
              {token ? (
                <div className={css.editButtonMargin}>
                  <CommentEditButton commentId={comment.id as string} />
                </div>
              ) : (
                ""
              )}
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export const ParagraphCommentSection = (p: {
  paragraph: TranslatedParagraph
}) => {
  const [{ data }] = Dailp.useParagraphCommentsQuery({
    variables: { paragraphId: p.paragraph.id },
  })
  const token = useCredentials()
  const userGroups = useCognitoUserGroups()
  const { commentForm, isEditingComment } = useForm()
  const { isCommenting, setIsCommenting } = useCommentStateContext()

  const paragraphComments = data?.paragraphById.comments

  return (
    <div>
      {paragraphComments?.map((comment) => (
        <div>
          {!(isEditingComment === comment.id) ? (
            <>
              <CommentHeader comment={comment} />
              <CommentBody comment={comment} />
            </>
          ) : (
            <>
              <CommentPanel
                segment={p.paragraph}
                setIsCommenting={setIsCommenting}
                commentAction={CommentAction.EditComment}
                commentObject={comment}
              />
              {token ? (
                <div className={css.editButtonMargin}>
                  <CommentEditButton commentId={comment.id as string} />
                </div>
              ) : (
                ""
              )}
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export const CommentBody = (p: { comment: Dailp.Comment }) => {
  const commentTypeNames: Record<Dailp.CommentType, string> = {
    // ... TS will then make sure you have an entry for everything on the "CommentTag" type that you import from the codegen
    [Dailp.CommentType.Story]: "Story",
    [Dailp.CommentType.Suggestion]: "Suggestion",
    [Dailp.CommentType.Question]: "Question",
  }
  const token = useCredentials()
  const { commentForm, isEditingComment } = useForm()

  return (
    <div className={css.commentWrapper}>
      {p.comment.textContent}
      <div className={css.commentFooters}>
        <div
          className={
            p.comment.commentType === Dailp.CommentType.Story
              ? css.tagColorStory
              : p.comment.commentType === Dailp.CommentType.Suggestion
              ? css.tagColorSuggestion
              : css.tagColorQuestion
          }
        >
          {p.comment.commentType
            ? commentTypeNames[p.comment.commentType as Dailp.CommentType]
            : ""}
        </div>
        <div>
          {token ? <CommentEditButton commentId={p.comment.id as string} /> : ""}
        </div>
      </div>
    </div>
  )
}

export const CommentHeader = (p: { comment: Dailp.Comment }) => {
  return (
    <div className={css.headerStyle}>
      {p.comment.postedBy.displayName} contributed on{" "}
      {p.comment.postedAt.date.formattedDate}
      {p.comment.edited ? " (edited)" : ""}
    </div>
  )
}
