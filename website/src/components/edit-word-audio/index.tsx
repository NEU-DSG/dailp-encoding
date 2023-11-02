import { ReactElement } from "react"
import { UserRole, useCognitoUserGroups, useUserRole } from "../../auth"
import * as Dailp from "../../graphql/dailp"
import { ContributorEditWordAudio } from "./contributor"
import { EditorEditWordAudio } from "./editor"

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
