import React, { ReactNode, SetStateAction } from "react"
import { useState } from "react"
import * as Dailp from "src/graphql/dailp"
import { TranslatedParagraph } from "src/segment"
import * as css from "./comment-section.css"

export const CommentSection = (p: {
  parent: Dailp.FormFieldsFragment | TranslatedParagraph
}) => {
  return (
    <div>
      {p.parent.__typename === "DocumentParagraph" ? (
        <ParagraphCommentSection paragraph={p.parent} />
      ) : p.parent.__typename === "AnnotatedForm" ? (
        <WordCommentSection word={p.parent} />
      ) : (
        ""
      )}
    </div>
  )
}

export const WordCommentSection = (p: { word: Dailp.FormFieldsFragment }) => {
  const [{ data }] = Dailp.useWordCommentsQuery({
    variables: { wordId: p.word.id },
  })

  const wordComments = data?.wordById

  return (
    <div>
      {wordComments?.comments.map((comment) => (
        <div>
          <CommentHeader comment={comment} />
          <CommentBody comment={comment} />
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

  const paragraphComments = data?.paragraphById

  return (
    <div>
      {paragraphComments?.comments.map((comment) => (
        <div>
          <div>
            <CommentHeader comment={comment} />
          </div>
          <CommentBody comment={comment} />
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

  return (
    <div className={css.commentWrapper}>
      {p.comment.textContent}
      <div className={css.tagPadding}>
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
      </div>
    </div>
  )
}

export const CommentHeader = (p: { comment: Dailp.Comment }) => {
  return (
    <div className={css.headerStyle}>
      {p.comment.postedBy.displayName} contributed on{" "}
      {p.comment.postedAt.date.formattedDate}
    </div>
  )
}
