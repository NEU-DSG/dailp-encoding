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
        <ParagraphCommentSection
          // Actually call the specific query and map here
          // to each individual comment
          paragraph={p.parent}
        />
      ) : p.parent.__typename === "AnnotatedForm" ? (
        <WordCommentSection word={p.parent} />
      ) : (
        ""
      )}
    </div>
  )
}

export const WordCommentSection = (p: { word: Dailp.FormFieldsFragment }) => {
  // Use GraphQL query, iterate through returned comments,
  // rendering a CommentHeader and CommentBody for each
  return <div></div>
}

export const ParagraphCommentSection = (p: {
  paragraph: TranslatedParagraph
}) => {
  return <div></div>
}

export const CommentBody = (p: {}) => {}

export const CommentHeader = (p: {}) => {}
