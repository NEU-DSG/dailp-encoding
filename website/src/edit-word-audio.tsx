import { ReactElement } from "react"
import { UserRole, useCognitoUserGroups, useUserRole } from "./auth"
import { ContributorEditWordAudio } from "./edit-word-audio-contributor"
import { EditorEditWordAudio } from "./edit-word-audio-editor"
import * as Dailp from "./graphql/dailp"

export const EditWordAudio = (p: {
  word: Dailp.FormFieldsFragment
}): ReactElement => {
  const userRole = useUserRole()
  // const userRole = UserRole.CONTRIBUTOR

  switch (userRole) {
    case UserRole.CONTRIBUTOR:
      return <ContributorEditWordAudio word={p.word} />
    case UserRole.EDITOR:
      return <EditorEditWordAudio word={p.word} />
    case UserRole.READER:
      return <div>You do not have permission to edit word audio.</div>
  }
}
