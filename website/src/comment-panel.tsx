import React, { ReactNode } from "react"
import * as Dailp from "src/graphql/dailp"
import { TranslatedParagraph } from "./segment"
import { useState } from "react"
import { Button } from "./components"
import * as css from "./comment-panel.css"

export const CommentPanel = (p: {
    word: Dailp.FormFieldsFragment | null
    segment: TranslatedParagraph | null
}) => {
    const [newCommentText, setNewCommentText] = useState<string>('')
    const [newCommentType, setNewCommentType] = useState('')

    // Prob messing up smth here
    const [postCommentResult, postComment] = Dailp.usePostCommentMutation()

    const options = [
        // There is def a better way to do this..
        'Story',
        'Suggestion',
        'Question',
      ];
    
    /** Call the backend GraphQL mutation. */
    const runUpdate = async (variables: {
        input: Dailp.PostCommentInput
    }) => {
        return await postComment(variables)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewCommentText(event.target.value);
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewCommentType(event.target.value);
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
    
        runUpdate({
            input: {
              parentId: p.word? p.word.id : (p.segment? p.segment.id : null),
              parentType: p.word ? Dailp.CommentParentType.Word : Dailp.CommentParentType.Paragraph,
              textContent: newCommentText,
              commentType: newCommentType == 'Story' ? Dailp.CommentType.Story : 
              (newCommentType == 'Suggestion' ? Dailp.CommentType.Suggestion 
              : Dailp.CommentType.Question),
            },
          })
    
        console.log('Submitted!');
    };
    
    return(<div>
      <h2 className={css.editCherHeader}>{p.segment ? p.segment.source : p.word?.source}</h2>
        <input
          type="text"
          placeholder="Add a comment"
          value={newCommentText}
          onChange={handleInputChange}
          className={css.spacing}
        />
        <div>
      <label htmlFor="dropdown" className={css.spacing}>Tag:</label>
      <select id="dropdown" value={newCommentType} onChange={handleSelectChange} className={css.spacing}>
        <option value="">Select...</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
        <Button type="button" className={css.commentButton} onClick={handleSubmit}>Save</Button>
      </div>)
}

export default CommentPanel