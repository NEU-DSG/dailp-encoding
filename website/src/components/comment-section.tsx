import React, { ReactNode, SetStateAction } from "react"
import { useState } from "react"
import * as Dailp from "src/graphql/dailp"
import { TranslatedParagraph } from "src/segment"

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
          <CommentHeader comment={comment} />
          <CommentBody comment={comment} />
        </div>
      ))}
    </div>
  )
}

export const CommentBody = (p: { comment: Dailp.Comment }) => {
  return <div>{p.comment.textContent}</div>
}

export const CommentHeader = (p: { comment: Dailp.Comment }) => {
  return (
    <div>
      {p.comment.postedBy.displayName} contributed on{" "}
      {p.comment.postedAt.date.formattedDate}
    </div>
  )
}
