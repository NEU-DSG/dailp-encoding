import { ReactElement } from "react"
import { UserRole, useUserRole } from "./auth"
import { ContributorEditWordAudio } from "./edit-word-audio-contributor"
import { EditorEditWordAudio } from "./edit-word-audio-editor"
import * as Dailp from "./graphql/dailp"

export const EditWordAudio = (p: {
  word: Dailp.FormFieldsFragment
}): ReactElement => {
  // const userRole = useUserRole()
  const userRole = UserRole.CONTRIBUTOR

  if (userRole === UserRole.CONTRIBUTOR)
    return <ContributorEditWordAudio word={p.word} />
  else if (userRole === UserRole.EDITOR)
    return <EditorEditWordAudio word={p.word} />
  else return <div>You do not have permission to edit word audio.</div>
}
